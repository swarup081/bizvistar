/**
 * Cloudinary URL helper utility.
 * 
 * Build optimized Cloudinary image URLs with automatic
 * format negotiation (WebP/AVIF) and quality optimization.
 * 
 * Usage:
 *   import { getCloudinaryUrl } from '@/lib/cloudinary';
 *   const url = getCloudinaryUrl('bizvistar/avenix/filename', { width: 800 });
 */

/**
 * @param {string} publicId - e.g. "bizvistar/avenix/filename"
 * @param {object} options
 * @param {number} [options.width]
 * @param {number} [options.height]
 * @param {string} [options.quality='auto'] - 'auto', 'auto:low', 'auto:best', or 1-100
 * @param {string} [options.format='auto'] - 'auto', 'webp', 'avif', 'jpg', 'png'
 * @param {string} [options.crop] - 'fill', 'fit', 'scale', 'thumb', etc.
 * @returns {string} Optimized Cloudinary URL
 */
export function getCloudinaryUrl(publicId, options = {}) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
        console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set');
        return '';
    }

    const {
        width,
        height,
        quality = 'auto',
        format = 'auto',
        crop
    } = options;

    const transforms = [`q_${quality}`, `f_${format}`];
    if (width) transforms.push(`w_${width}`);
    if (height) transforms.push(`h_${height}`);
    if (crop) transforms.push(`c_${crop}`);

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(',')}/${publicId}`;
}
