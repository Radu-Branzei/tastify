import { trigger, transition, style, animate, query, stagger } from "@angular/animations";

export let fadeInSlow = trigger('fadeInSlow', [
    transition(':enter', [
        style({ opacity: 0, transform: 'translateY(100%)' }),
        animate('2000ms 1000ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ])
]);

export let fadeIn = trigger('fadeIn', [
    transition(':enter', [
        style({ opacity: 0, transform: 'translateY(100%)' }),
        animate('500ms 500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ])
]);