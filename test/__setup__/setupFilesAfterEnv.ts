import 'jest-extended/all';
import '@testing-library/jest-dom';

import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-component-name' });
