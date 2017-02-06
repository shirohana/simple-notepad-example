<template lang="pug">

nav.toolbar
  .block.is-hidden-tablet
    a.button.is-primary.is-inverted( @click="toggleList()")
      span.icon.is-small
        i.fa.fa-bars
  .block
    a.button.is-primary.is-inverted( @click="addNote()")
      span.icon.is-small
        i.fa.fa-plus
  .block
    a.button.is-primary.is-inverted( @click="deleteNote()", :disabled="!canDelete")
      span.icon.is-small
        i.fa.fa-trash
  .block
    a.button.is-primary.is-inverted.is-disabled
      span.icon.is-small
        i.fa.fa-search

</template>

<script>

export default {

  computed: {
    canDelete () {
      return this.$store.getters.canDelete;
    }
  },

  methods: {
    addNote () {
      this.$store.dispatch('addNote');
      if (this.$mq.isMobile()) {
        this.$store.dispatch('toggleList', false);
      }
      this.$store.dispatch('focusEditor');
    },
    deleteNote () { this.$store.dispatch('deleteNote'); },
    toggleList () { this.$store.dispatch('toggleList'); }
  },

};

</script>

<style lang="stylus" scoped>

.toolbar
  height: 100%
  padding: 0.75rem
  background-color: #f0f0f0

  .block
    &:not(:last-child)
      margin-bottom: .75rem

    .button
      border-radius: 100%
      width: 2.2rem
      height: 2.2rem

      &.is-inverted
        border-color: #d9d9d9

        &:hover
          background-color: initial
          border-color: #00d1b2

</style>
