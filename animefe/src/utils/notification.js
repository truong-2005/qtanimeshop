export const showNotification = (message, type = 'info') => {
  // Tránh dùng thư viện ngoài nếu không cần thiết, ta có thể dùng alert tạm thời
  // hoặc có thể tích hợp với một library như react-toastify sau này.
  
  // Basic implementation
  switch(type) {
    case 'success':
      console.log(`✅ SUCCESS: ${message}`);
      break;
    case 'error':
      console.error(`❌ ERROR: ${message}`);
      break;
    case 'warning':
      console.warn(`⚠️ WARNING: ${message}`);
      break;
    default:
      console.log(`ℹ️ INFO: ${message}`);
  }

  // Tạm thời dùng alert cho error/success quan trọng nếu chưa có UI toast
  if (type === 'error') {
    alert(message);
  }
};
