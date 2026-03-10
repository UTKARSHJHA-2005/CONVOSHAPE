import React, { useEffect, useRef, useState } from "react";
import { doc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../db";

const servers = {
    iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
};

export default function CallPage({ type, onEnd }) {
    const localVideo = useRef(null);
    const remoteVideo = useRef(null);
    const pc = useRef(null);

    const [stream, setStream] = useState(null);
    const [videoOn, setVideoOn] = useState(type === "video");
    const [muted, setMuted] = useState(false);

    useEffect(() => {
        startMedia();
    }, []);

    const startMedia = async () => {
        try {
            pc.current = new RTCPeerConnection(servers);

            const media = await navigator.mediaDevices.getUserMedia({
                video: type === "video",
                audio: true,
            });
            const callDoc = doc(db, "calls", chatId);

            const offer = await pc.current.createOffer();
            await pc.current.setLocalDescription(offer);

            await setDoc(callDoc, {
                offer: {
                    type: offer.type,
                    sdp: offer.sdp,
                },
            });

            setStream(media);

            if (localVideo.current) {
                localVideo.current.srcObject = media;
            }

            // add tracks to peer connection
            media.getTracks().forEach((track) => {
                pc.current.addTrack(track, media);
            });

            // listen for remote stream
            pc.current.ontrack = (event) => {
                if (remoteVideo.current) {
                    remoteVideo.current.srcObject = event.streams[0];
                }
            };

        } catch (err) {
            console.error("Camera/Mic permission error:", err);
        }
    };

    const toggleVideo = () => {
        if (!stream) return;

        const videoTracks = stream.getVideoTracks();

        if (!videoTracks || videoTracks.length === 0) return;

        const videoTrack = videoTracks[0];

        videoTrack.enabled = !videoTrack.enabled;
        setVideoOn(videoTrack.enabled);
    };

    const toggleMute = () => {
        if (!stream) return;

        const audioTracks = stream.getAudioTracks();

        if (!audioTracks || audioTracks.length === 0) return;

        const audioTrack = audioTracks[0];

        audioTrack.enabled = !audioTrack.enabled;
        setMuted(!audioTrack.enabled);
    };

    const endCall = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }

        if (pc.current) {
            pc.current.close();
        }

        onEnd();
    };

    useEffect(() => {
        const callDoc = doc(db, "calls", chatId);

        const unsub = onSnapshot(callDoc, async (snapshot) => {
            const data = snapshot.data();

            if (!pc.current) return;

            if (data?.offer && !pc.current.currentRemoteDescription) {
                await pc.current.setRemoteDescription(
                    new RTCSessionDescription(data.offer)
                );

                const answer = await pc.current.createAnswer();
                await pc.current.setLocalDescription(answer);

                await updateDoc(callDoc, {
                    answer: {
                        type: answer.type,
                        sdp: answer.sdp,
                    },
                });
            }

            if (data?.answer && !pc.current.currentRemoteDescription) {
                await pc.current.setRemoteDescription(
                    new RTCSessionDescription(data.answer)
                );
            }
        });

        return () => unsub();
    }, []);
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "calls", chatId), (snap) => {
            const data = snap.data();

            if (data?.candidate) {
                const candidate = new RTCIceCandidate(JSON.parse(data.candidate));
                pc.current.addIceCandidate(candidate);
            }
        });

        return () => unsub();
    }, []);

    return (
        <div className="fixed bottom-5 right-5 w-[350px] bg-gray-900 p-4 rounded-xl shadow-xl flex flex-col items-center z-50">
            <div className="flex space-x-6 mb-6">
                <div className="relative w-full">

                    <video
                        ref={remoteVideo}
                        autoPlay
                        playsInline
                        className="w-full rounded-lg"
                    />

                    <video
                        ref={localVideo}
                        autoPlay
                        muted
                        playsInline
                        className="w-24 rounded-lg absolute bottom-2 right-2 border border-white"
                    />

                </div>
            </div>

            <div className="flex justify-between w-full mt-3">
                <button
                    onClick={toggleMute}
                    className="bg-gray-700 text-white px-3 py-2 rounded"
                >
                    {muted ? "Unmute" : "Mute"}
                </button>

                <button
                    onClick={toggleVideo}
                    className="bg-gray-700 text-white px-3 py-2 rounded"
                >
                    {videoOn ? "Video Off" : "Video On"}
                </button>

                <button
                    onClick={endCall}
                    className="bg-red-600 text-white px-3 py-2 rounded"
                >
                    End
                </button>

            </div>
        </div>
    );
}