import React, { useEffect, useRef, useState } from "react";

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
            const media = await navigator.mediaDevices.getUserMedia({
                video: type === "video",
                audio: true,
            });

            setStream(media);

        } catch (err) {
            console.error("Camera/Mic permission error:", err);
        }
    };

    const toggleVideo = () => {
        if (!stream) return;

        const videoTrack = stream.getVideoTracks()[0];

        if (!videoTrack) return;

        videoTrack.enabled = !videoTrack.enabled;
        setVideoOn(videoTrack.enabled);
    };

    const toggleMute = () => {
        if (!stream) return;

        const audioTrack = stream.getAudioTracks()[0];

        if (!audioTrack) return;

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

    return (
        <div className="fixed bottom-5 right-5 w-[350px] bg-gray-900 p-4 rounded-xl shadow-xl flex flex-col items-center z-50">
            <div className="flex space-x-6 mb-6">
                <div className="relative w-full">

                    <video
                        ref={remoteVideo}
                        autoPlay
                        className="w-full rounded-lg"
                    />

                    <video
                        ref={localVideo}
                        autoPlay
                        muted
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