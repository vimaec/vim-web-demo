export interface Page {
  name: string;
  github: string;
  content: () => JSX.Element;
}