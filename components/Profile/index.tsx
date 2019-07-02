import React from 'react';
import { Query } from 'react-apollo';
import { USER_QUERY } from 'graphql/Queries/User';

import { ProfileProps } from './types';
import {
  UserQuery,
  UserQueryVariables,
} from 'graphql/Queries/generated/UserQuery';
import ProfileInfoRenderer from './InfoRenderer';

const Profile = ({ userId }: ProfileProps) => {
  return (
    <Query<UserQuery, UserQueryVariables>
      query={USER_QUERY}
      variables={{
        id: userId,
      }}
    >
      {params => <ProfileInfoRenderer {...params} />}
    </Query>
  );
};

export default Profile;