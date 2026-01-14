/**
 * MSW 브라우저 설정
 *
 * 브라우저 환경에서 Service Worker를 통해 API를 모킹합니다.
 */

import { setupWorker } from 'msw/browser';
import { benefitHandlers } from './handlers/benefits';

export const worker = setupWorker(...benefitHandlers);
