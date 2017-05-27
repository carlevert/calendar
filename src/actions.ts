import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory();

export const testAction = actionCreator("TEST_ACTION");
