<template>
    <b-field :type="{'is-danger': !isCategoryValid}" :message="{'Please choose one of your categories': !isCategoryValid}" class="autocomplete-field">
    <b-autocomplete 
      v-model="category" 
      placeholder="Choose a category"
      :data="filteredCategories"
      :open-on-focus="true"
      :clearable="true"
      :loading="loading"
      required="true"
      @input="$emit('select', category)"
      >
      <template #footer>
        <a><span> Add a category... </span></a>
      </template>
      <template #empty>No results {{category ? "for" : ""}} {{category}}</template>
    </b-autocomplete>
  </b-field>
</template>

<script>

export default {
  name: "CategoryAutocomplete",
  props: {
    value: {
      type: String,
      default: null,
    },
    categories: {
      type: Array,
      default: [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      category: this.value,
    };
  },
  computed: {
    filteredCategories() {
      return this.categories.filter((category) => {
        return category.toLowerCase().includes(this.category === null ? "" : this.category.toLowerCase());
      });
    },
    isCategoryValid() {
      return this.category === null || !this.categories || this.categories.includes(this.category);
    },
  }
}

</script>