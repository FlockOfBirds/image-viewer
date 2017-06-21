declare namespace ofi {
    export function objectFitImages(images: any, options?: { watchMQ: boolean }): void;
}
declare module "object-fit-images" {
    export = ofi.objectFitImages;
}
