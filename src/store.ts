import { configureStore } from "@reduxjs/toolkit";
import { topicApi } from "./services/topic";
import { messageApi } from "./services/message";
import { acceptingMessagesApi } from "./services/acceptingMessages";
import { suggestedMessageApi } from "./services/suggestedMessages";

export const store = configureStore({
  reducer: {
    [topicApi.reducerPath]: topicApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    [acceptingMessagesApi.reducerPath]: acceptingMessagesApi.reducer,
    [suggestedMessageApi.reducerPath]: suggestedMessageApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      topicApi.middleware,
      messageApi.middleware,
      acceptingMessagesApi.middleware,
      suggestedMessageApi.middleware
    ),
});
