import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

const getIP = (request) =>
    request.headers['x-forwarded-for'] ||
    request.connection?.remoteAddress ||
    request.socket?.remoteAddress ||
    request.connection?.socket?.remoteAddress ||
    '';

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 dakika
    max: 2, // 1 dakikada izin verilen maksimum istek sayısı
    keyGenerator: getIP,
});

const speedLimiter = slowDown({
    windowMs: 60 * 1000, // 1 dakika
    delayAfter: 10, // 10 istekten sonra gecikme başlar
    delayMs: 500, // Her gecikme miktarı
    keyGenerator: getIP,
});

export default function applyRateLimit(req, res, next) {
    limiter(req, res, (err) => {
        if (err) {
            if (err instanceof Error) {
                console.error('Rate limit error:', err);
            }
            next(err); // Hata durumunda `next()` işlevini çağır
        } else {
            speedLimiter(req, res, next);
        }
    });
}

