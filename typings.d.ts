declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
  const url: string;
  export default url;
}
declare namespace TYPES {
  type RemoveBgData = {
    foreground_height: number;
    foreground_left: number;
    foreground_top: number;
    foreground_width: number;
    result_b64: string;
  };
}
