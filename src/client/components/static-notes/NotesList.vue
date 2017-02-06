<template lang="pug">

aside.menu
  p.menu-label 記事
  ul.menu-list
    li( v-for="note in notes", :key="note.id")
      a( :class="{ 'is-active': note.id === activeNote.id }", @click="updateActiveNote(note)")
        | {{ getTitleOfNote(note) }}

</template>

<script>

import { mapState } from 'vuex';

export default {

  computed: mapState({
    notes: state => state.notes.notes,
    activeNote: state => state.notes.activeNote
  }),

  methods: {
    updateActiveNote (note) {
      this.$store.dispatch('updateActiveNote', note);
      if (this.$mq.isTablet()) {
        this.$store.dispatch('focusEditor');
      }
    },

    getTitleOfNote ({ content }) {
      let trimmed = content.trim();
      return trimmed === "" ? "新筆記" : trimmed.split('\n')[0];
    }
  },

};

</script>

<style lang="stylus" scoped>

.menu
  width: 100%
  height: 100%
  padding: .75rem

  .menu-list a
    white-space: nowrap
    text-overflow: ellipsis
    overflow: hidden

</style>