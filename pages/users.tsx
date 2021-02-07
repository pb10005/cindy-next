import React from 'react';
import Head from 'next/head';

import { FormattedMessage, useIntl } from 'react-intl';
import messages from 'messages/pages/users';

import PaginatedQuery from 'components/Hoc/PaginatedQuery';
import { USER_LIST_QUERY } from 'graphql/Queries/User';

import { Heading, Flex } from 'components/General';
import MultiColBox from 'components/General/MultiColBox';
import UserPanel from 'components/User/UserPanel';

import {
  UserListQuery,
  UserListQueryVariables,
} from 'graphql/Queries/generated/UserListQuery';

const Users = () => {
  const intl = useIntl();
  const _ = intl.formatMessage;

  return (
    <React.Fragment>
      <Head>
        <title>{_(messages.title)} | Cindy</title>
        <meta name="description" content={_(messages.description)} />
      </Head>
      <Heading>
        <FormattedMessage {...messages.header} />
      </Heading>
      <Flex flexWrap="wrap">
        <PaginatedQuery<UserListQuery, UserListQueryVariables>
          query={USER_LIST_QUERY}
          variables={{ limit: 20 }}
          fetchPolicy="cache-first"
          getItemCount={data => data.userCount}
          renderItems={data => {
            const { users } = data;
            if (!users) return null;
            return (
              <>
                {users.map(user => (
                  <MultiColBox key={user.id}>
                    <UserPanel user={user} />
                  </MultiColBox>
                ))}
              </>
            );
          }}
        />
      </Flex>
    </React.Fragment>
  );
};

export async function getStaticProps() {
  return {
    props: {
      serverSideContext: {
        route: '/users',
      },
    },
  };
}

export default Users;
