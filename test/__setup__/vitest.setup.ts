import '@testing-library/jest-dom';

import { configure } from '@testing-library/react';
import * as matchers from 'jest-extended';

expect.extend(matchers);

configure({ testIdAttribute: 'data-component-name' });

// eslint-disable-next-line @vitest/prefer-spy-on
Element.prototype.scrollIntoView = vi.fn();
