<template>
    <b-field :type="{'is-danger': isValidationEnabled && !isCategoryValid}" :message="{'Please choose one of your categories': isValidationEnabled && !isCategoryValid}" class="autocomplete-field">
    <b-autocomplete 
      v-model="category" 
      placeholder="Choose a category"
      :data="filteredCategories"
      :open-on-focus="true"
      :clearable="true"
      :loading="loading"
      required="true"
      @input="$emit('select', category)"
      ref="autocomplete"
      >
      <template #header>
        <a @click="addCategoryHandler"><span> Add a category... </span></a>
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
    // categories: {
    //   type: Array,
    //   default: [],
    // },
    // loading: {
    //   type: Boolean,
    //   default: false,
    // },
    isValidationEnabled: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      category: this.value,
    };
  },
  computed: {
    categories() {
      return this.$store.state.categories || [];
    },
    loading() {
      return this.categories === null;
    },
    filteredCategories() {
      return this.categories.filter((category) => {
        return category.toLowerCase().includes(this.category === null ? "" : this.category.toLowerCase());
      });
    },
    isCategoryValid() {
      return this.category === null || !this.categories || this.categories.includes(this.category);
    },
  },
  methods: {
    focus() {
      this.$refs.autocomplete.focus();
    },
    reset() {
      this.category = null;
      this.focus();
    },
    addCategoryHandler() {
      this.$buefy.dialog.prompt({
        message: `Add a new category:`,
        inputAttrs: {
          placeholder: 'Category name',
          value: this.category,
        },
        onConfirm: value => this.addCategory(value)
      });

    },
    addCategory(category) {
      fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: category }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.error) {
            this.$buefy.toast.open({
              message: res.error,
              type: "is-danger",
            });
            return;
          }
          this.$store.dispatch("fetchCategories");
          this.reset();
        });
    },
  }
}

</script>

<style>
.modal {
  z-index: 9999;
}
</style>