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
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">

            <div className="flex space-x-6 mb-6">
                <video
                    ref={localVideo}
                    autoPlay
                    muted
                    className="w-64 rounded-lg"
                />

                <video
                    ref={remoteVideo}
                    autoPlay
                    className="w-64 rounded-lg"
                />
            </div>

            <div className="flex space-x-6">

                <button
                    onClick={toggleMute}
                    className="bg-gray-700 text-white px-4 py-2 rounded"
                >
                    {muted ? "Unmute" : "Mute"}
                </button>

                <button
                    onClick={toggleVideo}
                    className="bg-gray-700 text-white px-4 py-2 rounded"
                >
                    {videoOn ? "Video Off" : "Video On"}
                </button>

                <button
                    onClick={endCall}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                >
                    End Call
                </button>

            </div>
        </div>
    );
}