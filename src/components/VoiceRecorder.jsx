import { useState, useEffect, useCallback } from "react";

const VoiceRecorder = ({ onStop, isRecording, setIsRecording }) => {
    const [mediaRecorder, setMediaRecorder] = useState(null);

    // Memoize startRecording function
    const startRecording = useCallback(() => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const recorder = new MediaRecorder(stream);
                setMediaRecorder(recorder);

                recorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        const blob = new Blob([event.data], { type: 'audio/wav' });
                        onStop(blob); // Pass the blob to the parent
                    }
                };

                recorder.onstop = () => {
                    setIsRecording(false);
                };

                recorder.start();
            })
            .catch(error => {
                console.error('Error accessing audio devices:', error);
            });
    }, [onStop, setIsRecording]);

    useEffect(() => {
        if (isRecording) {
            startRecording();
        } else if (mediaRecorder) {
            mediaRecorder.stop();
        }

        // Cleanup function
        return () => {
            if (mediaRecorder) {
                mediaRecorder.stop();
            }
        };
    }, [isRecording, mediaRecorder, startRecording]);

    return null;
};

export default VoiceRecorder;
