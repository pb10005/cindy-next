import triggers from '../triggers';
import { query, mutation } from '../db/hasura';
import gql from 'graphql-tag';
import { pubsub } from '../pubsub';

const UserBriefQuery = gql`
  query UserBriefQuery($id: Int!) {
    sui_hei_user_by_pk(id: $id) {
      id
      nickname
      username
      sui_hei_current_useraward {
        id
        created
        sui_hei_award {
          id
          name
          description
        }
      }
    }
  }
`;

const addUserHandler = (data, response) => {
  const { user_id } = data.event.data.new;
  query({
    query: UserBriefQuery,
    variables: {
      id: user_id,
    },
  }).then(result => {
    const newData = { ...data };
    newData.event.data.new.sui_hei_user = result.data.sui_hei_user_by_pk;
    pubsub.publish(data.trigger.name, newData);
  });
};

const addReceiverHandler = (data, response) => {
  const { receiver_id } = data.event.data.new;
  if (!receiver_id) {
    pubsub.publish(data.trigger.name, data);
    return;
  }
  Promise.all([
    query({
      query: UserBriefQuery,
      variables: {
        id: receiver_id,
      },
    }),
    query({
      query: UserBriefQuery,
      variables: {
        id: sender_id,
      },
    }),
  ]).then(([receiverResult, senderResult]) => {
    const newData = { ...data };
    newData.event.data.new.receiver = receiverResult.data.sui_hei_user_by_pk;
    newData.event.data.new.sender = senderResult.data.sui_hei_user_by_pk;
    pubsub.publish(data.trigger.name, newData);
  });
};

const addSenderReceiverHandler = (data, response) => {
  const { sender_id, receiver_id } = data.event.data.new;
  if (!receiver_id || !sender_id) {
    pubsub.publish(data.trigger.name, data);
    return;
  }
  query({
    query: UserBriefQuery,
    variables: {
      id: receiver_id,
    },
  }).then(result => {
    const newData = { ...data };
    newData.event.data.new.receiver = result.data.sui_hei_user_by_pk;
    pubsub.publish(data.trigger.name, newData);
  });
};

const controller = (request, response) => {
  const data = request.body;
  try {
    switch (data.trigger.name) {
      case triggers.ON_DIRECTMESSAGE_CHANGE:
        addSenderReceiverHandler(data, response);
        break;
      case triggers.ON_CHATMESSAGE_CHANGE:
      case triggers.ON_DIALOGUE_CHANGE:
      case triggers.ON_PUZZLE_CHANGE:
        addUserHandler(data, response);
        break;
      case triggers.ON_HINT_CHANGE:
        addReceiverHandler(data, response);
        break;
    }
    response.status(200).json({ status: 'successful' });
  } catch (e) {
    console.log(`Error in subscriptionController: ${JSON.stringify(e)}`);
    response.status(500).json({ error: e });
  }
};

export default controller;
