const requests = new Map();

export function rateLimit(ip, maxRequests = 100, windowMs = 900000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!requests.has(ip)) {
    requests.set(ip, []);
  }
  
  const userRequests = requests.get(ip);
  const validRequests = userRequests.filter(timestamp => timestamp > windowStart);
  
  requests.set(ip, validRequests);
  
  if (validRequests.length >= maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: windowStart + windowMs
    };
  }
  
  validRequests.push(now);
  requests.set(ip, validRequests);
  
  return {
    success: true,
    remaining: maxRequests - validRequests.length,
    resetTime: windowStart + windowMs
  };
}

export function getRealIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress || 
         '127.0.0.1';
}