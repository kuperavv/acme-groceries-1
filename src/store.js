import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import logger from 'redux-logger';

const LOAD = 'LOAD';
const UPDATE = 'UPDATE';
const CREATE = 'CREATE';
const SET_VIEW = 'SET_VIEW';

const groceriesReducer = (state = [], action) => {
  if (action.type === LOAD) {
    state = action.groceries;
  }
  if (action.type === UPDATE) {
    state = state.map((grocery) =>
      grocery.id === action.grocery.id ? action.grocery : grocery
    );
  }
  if (action.type === CREATE) {
    state = [...state, action.grocery];
  }
  return state;
};

const viewReducer = (state = '', action) => {
  if (action.type === SET_VIEW) {
    state = action.view;
  }
  return state;
};

const reducer = combineReducers({
  groceries: groceriesReducer,
  view: viewReducer,
});

const store = createStore(reducer, applyMiddleware(thunk, logger));

const _create = (grocery) => {
  return {
    type: CREATE,
    grocery,
  };
};

const _update = (grocery) => {
  return {
    type: UPDATE,
    grocery,
  };
};

const _load = (groceries) => {
  return {
    type: LOAD,
    groceries,
  };
};

const load = () => {
  return async (dispatch) => {
    const groceries = (await axios.get('/api/groceries')).data;
    dispatch(_load(groceries));
  };
};

const create = (name) => {
  return async (dispatch) => {
    let grocery;
    if (name) {
      grocery = (await axios.post('/api/groceries', { name })).data;
    } else {
      grocery = (await axios.post('/api/groceries/random')).data;
    }
    dispatch(_create(grocery));
  };
};

const update = (grocery) => {
  return async (dispatch) => {
    const updated = (
      await axios.put(`/api/groceries/${grocery.id}`, {
        purchased: !grocery.purchased,
      })
    ).data;
    dispatch(_update(updated));
  };
};

export default store;
export { create, update, load };
