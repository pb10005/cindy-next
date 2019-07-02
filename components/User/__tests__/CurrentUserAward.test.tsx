import React from 'react';
import { mount } from 'enzyme';

import { IntlProvider } from 'react-intl';
import { ThemeProvider } from 'emotion-theming';
import theme from 'theme/theme';

import CurrentUserAward from '../CurrentUserAward';

const useraward = {
  id: 1,
  created: '2019-01-01T01:00:00Z',
  sui_hei_award: {
    id: 1,
    name: 'Awesome Award',
    description: "It's awesome!",
  },
};

describe('<CurrentUserAward />', () => {
  it('should work out of the box', () => {
    const node = mount(
      <IntlProvider locale="en">
        <ThemeProvider theme={theme}>
          <CurrentUserAward useraward={useraward} />
        </ThemeProvider>
      </IntlProvider>,
    );
    node.find('button').simulate('mouseenter');
    expect(node.find('div').length).toBeGreaterThan(0);
    node.find('button').simulate('mouseleave');
    expect(node.find('div').length).toBe(0);
    node.find('button').simulate('focus');
    expect(node.find('div').length).toBeGreaterThan(0);
    node.find('button').simulate('blur');
    expect(node.find('div').length).toBe(0);
  });
});
