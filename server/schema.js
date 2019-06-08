const gql = require('graphql-tag');
const { withFilter } = require('graphql-subscriptions');

const { pubsub } = require('./pubsub');
const triggers = require('./triggers');

const typeDefs = gql`
  # Query should not be empty according to graphql spec.
  scalar timestamptz
  enum EventType {
    INSERT
    UPDATE
    DELETE
  }
  type Query {
    dummy: Boolean
  }
  type sui_hei_award {
    id: Int!
    name: String!
    description: String!
  }
  type sui_hei_user_award {
    id: Int!
    created: timestamptz!
    sui_hei_award: sui_hei_award
  }
  type sui_hei_user {
    id: Int!
    username: String!
    nickname: String!
    sui_hei_current_useraward: sui_hei_user_award
  }
  type sui_hei_chatmessage {
    id: Int!
    user_id: Int!
    chatroom_id: Int!
    content: String!
    created: timestamptz!
    editTimes: Int!
    sui_hei_user: sui_hei_user
  }
  type sui_hei_dialogue {
    id: Int!
    question: String!
    questionEditTimes: Int!
    answer: String!
    answerEditTimes: Int!
    good: Boolean!
    true: Boolean!
    created: timestamptz!
    answeredtime: timestamptz
    puzzle_id: Int!
    user_id: Int!
    sui_hei_user: sui_hei_user
  }
  type sui_hei_hint {
    id: Int!
    content: String!
    created: timestamptz!
    puzzle_id: Int!
  }
  type sui_hei_directmessage {
    id: Int!
    content: String!
    created: timestamptz!
    receiver_id: Int!
    sender_id: Int!
  }
  type sui_hei_puzzle {
    id: Int!
    title: String!
    yami: Int!
    genre: Int!
    content: String!
    solution: String!
    created: timestamptz!
    modified: timestamptz!
    status: Int!
    memo: String!
    anonymous: Boolean!
    grotesque: Boolean!
    user_id: Int!
    sui_hei_user: sui_hei_user
  }
  type ChatmessageSubscription {
    sui_hei_chatmessage: sui_hei_chatmessage
    eventType: EventType
  }
  type DialogueHintSubscription {
    sui_hei_dialogue: sui_hei_dialogue
    sui_hei_hint: sui_hei_hint
    eventType: EventType
  }
  type DirectmessageSubscription {
    sui_hei_directmessage: sui_hei_directmessage
    eventType: EventType
  }
  type PuzzleSubscription {
    sui_hei_puzzle: sui_hei_puzzle
    eventType: EventType
  }
  type Subscription {
    chatmessageSub(chatroomId: Int!): ChatmessageSubscription
    dialogueHintSub(puzzleId: Int!): DialogueHintSubscription
    directmessageSub(userId: Int!): DirectmessageSubscription
    puzzleSub(puzzleId: Int!): PuzzleSubscription
  }
`;

const resolvers = {
  Query: {
    dummy: () => true,
  },
  Subscription: {
    chatmessageSub: {
      subscribe: withFilter(
        (payload, args) => pubsub.asyncIterator(triggers.ON_CHATMESSAGE_CHANGE),
        (payload, args) =>
          payload.event.data.new.chatroom_id === args.chatroomId,
      ),
      resolve: async (payload, args, context, info) => {
        const node = payload.event.data.new;
        return {
          eventType: payload.event.op,
          sui_hei_chatmessage: {
            ...node,
          },
        };
      },
    },
    dialogueHintSub: {
      subscribe: withFilter(
        (payload, args) =>
          pubsub.asyncIterator([
            triggers.ON_DIALOGUE_CHANGE,
            triggers.ON_HINT_CHANGE,
          ]),
        (payload, args) => payload.event.data.new.puzzle_id === args.puzzleId,
      ),
      resolve: async (payload, args, context, info) => {
        const nodes = {};
        if (payload.trigger.name === triggers.ON_DIALOGUE_CHANGE) {
          nodes.sui_hei_dialogue = payload.event.data.new;
        }
        if (payload.trigger.name === triggers.ON_HINT_CHANGE) {
          nodes.sui_hei_hint = payload.event.data.new;
        }
        return {
          eventType: payload.event.op,
          ...nodes,
        };
      },
    },
    directmessageSub: {
      subscribe: withFilter(
        (payload, args) =>
          pubsub.asyncIterator(triggers.ON_DIRECTMESSAGE_CHANGE),
        (payload, args) =>
          payload.event.data.new.sender_id === args.userId ||
          payload.event.data.new.receiver_id === args.userId,
      ),
      resolve: async (payload, args, context, info) => {
        const node = payload.event.data.new;
        return {
          eventType: payload.event.op,
          sui_hei_directmessage: {
            ...node,
          },
        };
      },
    },
    puzzleSub: {
      subscribe: withFilter(
        (payload, args) => pubsub.asyncIterator(triggers.ON_PUZZLE_CHANGE),
        (payload, args) => payload.event.data.new.id === args.puzzleId,
      ),
      resolve: async (payload, args, context, info) => {
        const node = payload.event.data.new;
        return {
          eventType: payload.event.op,
          sui_hei_puzzle: {
            ...node,
          },
        };
      },
    },
  },
};

module.exports = { typeDefs, resolvers };