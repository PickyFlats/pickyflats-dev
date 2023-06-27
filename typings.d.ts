// import { PassageElement } from '@passageidentity/passage-auth/*';
import { PassageElement } from '@passageidentity/passage-elements';

declare namespace JSX {
  interface IntrinsicElements {
    'passage-auth': PassageElement;
    [key: string]: any;
  }
}
