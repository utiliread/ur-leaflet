declare module "*.css" {
  const value: string;
  export default value;
}

declare module "*.html" {
  export const template: string;
  export default template;
}

declare module "*.png" {
  const value: any;
  export default value;
}
