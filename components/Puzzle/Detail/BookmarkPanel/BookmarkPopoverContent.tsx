import React, { useRef, useEffect } from 'react';
import { toast } from 'react-toastify';

import { Flex, Box, ButtonTransparent } from 'components/General';
import BookmarkInput from './BookmarkInput';

import { Query, Mutation } from 'react-apollo';
import { PREVIOUS_BOOKMARK_VALUE_QUERY } from 'graphql/Queries/Bookmark';

import { connect } from 'react-redux';
import * as globalReducer from 'reducers/global';

import { FormattedMessage } from 'react-intl';
import puzzleMessages from 'messages/components/puzzle';
import commonMessages from 'messages/common';

import { BookmarkPopoverContentProps } from './types';
import { ADD_BOOKMARK_MUTATION } from 'graphql/Mutations/Bookmark';
import {
  AddBookmarkMutation,
  AddBookmarkMutationVariables,
} from 'graphql/Mutations/generated/AddBookmarkMutation';
import { ApolloError } from 'apollo-client/errors/ApolloError';
import {
  PreviousBookmarkValueQuery,
  PreviousBookmarkValueQueryVariables,
} from 'graphql/Queries/generated/PreviousBookmarkValueQuery';
import { StateType } from 'reducers/types';

const BookmarkPopupContent = ({
  userId,
  puzzleId,
  setShow,
  buttonRef,
}: BookmarkPopoverContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null!);
  const inputRef = useRef<BookmarkInput>(null!);
  const notifHdlRef = useRef<React.ReactText | null>(null);

  useEffect(() => {
    return window.addEventListener('click', e => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node | null) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node | null)
      ) {
        setShow(false);
      }
    });
  }, []);

  return (
    <Flex ref={contentRef} width={1} flexWrap="wrap">
      {userId && (
        <Query<PreviousBookmarkValueQuery, PreviousBookmarkValueQueryVariables>
          query={PREVIOUS_BOOKMARK_VALUE_QUERY}
          variables={{
            puzzleId,
            userId,
          }}
        >
          {({ data, error }) => {
            if (error) {
              toast.error(error.message);
              return null;
            }
            if (!data || !data.sui_hei_bookmark) return null;
            const initialValue =
              data.sui_hei_bookmark.length === 0
                ? 0
                : data.sui_hei_bookmark[0].value;
            return (
              <>
                <Box width={1} pr={1}>
                  {initialValue === 0 ? (
                    <FormattedMessage {...puzzleMessages.addBookmarks} />
                  ) : (
                    <FormattedMessage {...puzzleMessages.yourBookmarks} />
                  )}
                </Box>
                <Mutation<AddBookmarkMutation, AddBookmarkMutationVariables>
                  mutation={ADD_BOOKMARK_MUTATION}
                  update={(proxy, { data }) => {
                    if (
                      !data ||
                      !data.insert_sui_hei_bookmark ||
                      data.insert_sui_hei_bookmark.returning.length === 0
                    )
                      return;
                    const newBookmark =
                      data.insert_sui_hei_bookmark.returning[0];
                    proxy.writeQuery<
                      PreviousBookmarkValueQuery,
                      PreviousBookmarkValueQueryVariables
                    >({
                      query: PREVIOUS_BOOKMARK_VALUE_QUERY,
                      variables: {
                        puzzleId,
                        userId: userId as number,
                      },
                      data: {
                        sui_hei_bookmark: [{ ...newBookmark }],
                      },
                    });
                  }}
                >
                  {addBookmark => (
                    <React.Fragment>
                      <BookmarkInput
                        ref={inputRef}
                        initialValue={initialValue}
                      />
                      <Box width={1} bg="orange.5">
                        <ButtonTransparent
                          width={1}
                          onClick={() => {
                            if (!inputRef.current) return;
                            const value = inputRef.current.state.value;
                            addBookmark({
                              variables: {
                                puzzleId,
                                value,
                              },
                              optimisticResponse: {
                                insert_sui_hei_bookmark: {
                                  __typename:
                                    'sui_hei_bookmark_mutation_response',
                                  returning: [
                                    {
                                      __typename: 'sui_hei_bookmark',
                                      id:
                                        data.sui_hei_bookmark.length > 0
                                          ? data.sui_hei_bookmark[0].id
                                          : -1,
                                      value,
                                    },
                                  ],
                                },
                              },
                            })
                              .then(res => {
                                if (!res) return;
                                const { errors } = res;
                                if (errors) {
                                  toast.error(JSON.stringify(errors));
                                } else {
                                  if (notifHdlRef.current)
                                    toast.dismiss(notifHdlRef.current);
                                  toast.info(
                                    <FormattedMessage
                                      {...commonMessages.saved}
                                    />,
                                  );
                                }
                              })
                              .catch((e: ApolloError) => {
                                if (notifHdlRef.current)
                                  toast.dismiss(notifHdlRef.current);
                                toast.error(e.message);
                              });
                            notifHdlRef.current = toast.info(
                              <FormattedMessage {...commonMessages.saving} />,
                            );
                          }}
                        >
                          <FormattedMessage {...commonMessages.save} />
                        </ButtonTransparent>
                      </Box>
                    </React.Fragment>
                  )}
                </Mutation>
              </>
            );
          }}
        </Query>
      )}
    </Flex>
  );
};

const mapStateToProps = (state: StateType) => ({
  userId: globalReducer.rootSelector(state).user.id,
});

const withRedux = connect(mapStateToProps);

export default withRedux(BookmarkPopupContent);