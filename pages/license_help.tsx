import React from 'react';
import Head from 'next/head';
import { text2md } from 'common/markdown';

import { connect } from 'react-redux';
import * as settingReducer from 'reducers/setting';

import { useIntl } from 'react-intl';
import eulaMessages from 'messages/pages/eula';

import Box from 'components/General/Box';

import { LicenseHelpProps } from 'pageTypes';
import { DEFAULT_LOCALE } from 'settings';
import { StateType } from 'reducers/types';

const getLicenseHelp = (locale: string) =>
  require(`markdown/LicenseHelp/${locale}.md`).default;

const LicenseHelp = ({ language }: LicenseHelpProps) => {
  const { formatMessage: _ } = useIntl();

  const locale = language || DEFAULT_LOCALE;
  const eulaText = getLicenseHelp(locale);

  return (
    <React.Fragment>
      <Head>
        <title>{_(eulaMessages.title)} | Cindy</title>
        <meta name="description" content={_(eulaMessages.description)} />
      </Head>
      <Box
        mx={[2, 4]}
        dangerouslySetInnerHTML={{ __html: text2md(eulaText) }}
      />
    </React.Fragment>
  );
};

const mapStateToProps = (state: StateType) => ({
  language: settingReducer.rootSelector(state).language,
});

const withRedux = connect(mapStateToProps);

export default withRedux(LicenseHelp);