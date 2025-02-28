import createElement from 'ts/createElement';

declare global {
    interface Window {
        createElement: any;
    }
}

window.createElement = createElement;