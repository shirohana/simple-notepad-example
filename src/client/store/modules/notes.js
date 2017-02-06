import Vue from 'vue';
import * as types from '../mutation-types';

import notesApi from '../../api/static-notes';

const state = {
  notes: [],
  activeNote: {},
  autoIncrement: 0,
  showNoteList: false,

  _activeNoteIndex: 0
};

const getters = {
  canDelete: state => {
    return state.activeNote === undefined
      ? false : state.activeNote.content !== "" || state.notes.length > 1;
  }
};

const actions = {

  fetchNotes ({ commit, dispatch }) {
    notesApi.get( (data) => {
      commit(types.FETCH_NOTES, data);
      dispatch('updateActiveNote');
    });
  },

  addNote ({ state, commit, dispatch }) {
    let index = ++state._activeNoteIndex;

    commit(types.ADD_NOTE, { index });
    dispatch('updateActiveNote');
  },

  editNote ({ commit }, note) {
    commit(types.EDIT_NOTE, note);
  },

  deleteNote ({ state, commit, dispatch }) {
    let index = state._activeNoteIndex == 0 ? 0 : state._activeNoteIndex--;

    commit(types.DELETE_NOTE, { index });
    dispatch('updateActiveNote');
  },

  updateActiveNote ({ state, commit }, note) {
    let index = (note === undefined)
      ? state._activeNoteIndex
      : state.notes.findIndex(each => each.id === note.id);

    if (index != -1) {
      commit(types.SET_ACTIVE_NOTE, { index });
      state._activeNoteIndex = index;
    } else {
      console.error("Error when finding index of note in store/modules/notes.js");
    }
  },

  toggleList ({ state, commit }, isShow) {
    state.showNoteList = isShow !== undefined ? isShow : !state.showNoteList;
    commit(types.TOGGLE_NOTE_LIST, state.showNoteList);
  },

  focusEditor ({ commit }) {
    commit(types.FOCUS_EDITOR);
  }

};

const mutations = {
  [types.FETCH_NOTES] (state, { lastId, notes }) {
    state.autoIncrement = lastId;
    state.notes = notes;
  },

  [types.ADD_NOTE] (state, { index }) {
    state.notes.splice(index, 0, {
      id: (state.activeId = ++state.autoIncrement),
      content: "",
    });
  },

  [types.EDIT_NOTE] (state, { content }) {
    state.activeNote.content = content;
  },

  [types.DELETE_NOTE] (state, { index }) {
    if (state.notes.length == 1) {
      state.notes[0].content = "";
    } else {
      state.notes.splice(index, 1);
    }
  },

  [types.SET_ACTIVE_NOTE] (state, { index }) {
    state.activeNote = state.notes[index];
    // state.activeNote = state.notes.find(note => note.id === id);
  },

  [types.TOGGLE_NOTE_LIST] (state, isShow) {
    state.showNoteList = isShow;
  },

  // for subscribing
  [types.FOCUS_EDITOR] (state) {  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
