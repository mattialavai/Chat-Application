// MyMessage.js
const MyMessage = ({ message }) => {
  if (message?.attachments?.length > 0) {
    return (
      <img
        src={message.attachments[0].file}
        alt="message-attachment"
        className="message-image"
        style={{ float: 'right' }}
      />
    );
  }
  return (
    <div className="message message-sent">
      {message.text}
    </div>
  );
};

export default MyMessage;
