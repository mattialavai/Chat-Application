import React, { useState } from "react";
import { sendMessage, isTyping } from "react-chat-engine";
import { SendOutlined, PictureOutlined, AudioOutlined } from "@ant-design/icons";
import VoiceRecorder from "./VoiceRecorder";

const MessageForm = (props) => {
    const [value, setValue] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recordingBlob, setRecordingBlob] = useState(null);
    const [recordingURL, setRecordingURL] = useState(null); // To hold the URL for playback
    const { chatId, creds } = props;

    const handleSubmit = (event) => {
        event.preventDefault();
        const text = value.trim();
        if (text.length > 0) {
            sendMessage(creds, chatId, { text });
        }
        if (recordingBlob) {
            const file = new File([recordingBlob], "voice-message.webm", { type: 'audio/webm' });
            sendMessage(creds, chatId, { files: [file], text: '' });
            setRecordingURL(URL.createObjectURL(recordingBlob)); // Create URL for playback
        }
        setValue('');
        setRecordingBlob(null);
        setRecordingURL(null);
    };

    const handleChange = (event) => {
        setValue(event.target.value);
        isTyping(props, chatId);
    };

    const handleUpload = (event) => {
        sendMessage(creds, chatId, { files: event.target.files, text: '' });
    };

    const handleRecord = () => {
        setIsRecording(true);
    };

    const handleStopRecording = (blob) => {
        setRecordingBlob(blob);
    };

    return (
        <form className="message-form" onSubmit={handleSubmit}>
            <input
                className="message-input"
                placeholder="Send a message ..."
                value={value}
                onChange={handleChange}
                onSubmit={handleSubmit}
            />
            <label htmlFor="upload-button">
                <span className="image-button">
                    <PictureOutlined className="picture-icon" />
                </span>
            </label>
            <input
                type="file"
                multiple={false}
                id="upload-button"
                style={{ display: 'none' }}
                onChange={handleUpload}
            />
            <span className="record-button" onClick={handleRecord}>
                <AudioOutlined className="record-icon" />
            </span>
            <button type="submit" className="send-button">
                <SendOutlined className="send-icon" />
            </button>
            {isRecording && <VoiceRecorder onStop={handleStopRecording} isRecording={isRecording} setIsRecording={setIsRecording} />}
            {recordingURL && (
                <div className="recording-preview">
                    <audio controls src={recordingURL}></audio>
                </div>
            )}
        </form>
    );
}

export default MessageForm;
