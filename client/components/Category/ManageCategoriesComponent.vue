<template>
  <section v-if="categories !== null" class="animate">
    <b-button class="is-primary" id="add-category" @click="addCategory"
      >Add category</b-button
    >

    <ul v-if="categories.length" id="categories-list">
      <li v-for="category in categories" :key="category.id" class="category">
        <span v-if="editing !== category">{{ category.name }}</span>
        <b-input v-else v-model="draft.name" v-on:keyup.native.enter="saveEdit(category)"></b-input>
        <span class="category-actions" v-if="!editing">
          <b-tooltip label="Edit"><a @click="startEdit(category)"><b-icon icon="pencil" /></a></b-tooltip>
          <b-tooltip label="Delete"><a @click="deleteCategory(category)"><b-icon icon="delete" /></a></b-tooltip>
        </span>
        <span class="category-actions" v-else-if="editing === category">
          <b-tooltip label="Save"><a @click="saveEdit(category)"><b-icon icon="check" /></a></b-tooltip>
          <b-tooltip label="Cancel"><a @click="discardEdit(category)"><b-icon icon="close" /></a></b-tooltip>
        </span>
      </li>
    </ul>
    <div v-else>
      <p>You have no categories yet. Add one!</p>
    </div>
  </section>
  <section v-else>
    <b-skeleton :animated="true"></b-skeleton>
    <b-skeleton :animated="true"></b-skeleton>
    <b-skeleton :animated="true"></b-skeleton>
    <b-skeleton :animated="true"></b-skeleton>
    <b-skeleton :animated="true"></b-skeleton>
    <b-skeleton :animated="true"></b-skeleton>
  </section>
</template>

<script>
export default {
  name: "ManageCategoriesComponent",
  data() {
    return {
      editing: null,
      draft: {},
      categories: null,
      isLoading: true
    };
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    fetchCategories() {
      fetch("/api/categories")
        .then((response) => response.json())
        .then((categories) => {
          this.categories = categories;
        });
    },
    saveCategories() {
      fetch("/api/categories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.categories),
      });
    },
    addCategory() {
      this.categories.unshift({ name: this.getUniqueName("Category") });
      if (!this.editing) {
        this.startEdit(this.categories[0]);
      }
      this.saveCategories();
    },
    startEdit(category) {
      this.editing = category;
      this.draft = Object.assign({}, category);
      const index = this.categories.indexOf(category);
      // focus on li with this index
      this.$nextTick(() => {
        this.$el
          .querySelector(`#categories-list li:nth-child(${index + 1}) input`)
          .focus();
      });
    },
    saveEdit(category) {
      this.editing = null;
      this.categories[this.categories.indexOf(category)] = this.draft;
      this.saveCategories();
    },
    discardEdit(category) {
      this.editing = null;
      this.draft = {};
    },
    deleteCategory(category) {
      this.$buefy.dialog.confirm({
        title: "Deleting category",
        message:
          "Are you sure you want to delete this category? It will also remove all the timelogs associated with it.",
        confirmText: "Delete category",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => {
          this.categories.splice(this.categories.indexOf(category), 1);
          this.saveCategories();
        },
      });
    },
    getUniqueName(prefix) {
      let names = new Set();
      this.categories.forEach((c) => {
        names.add(c.name);
      });
      let ptr = 1;
      while (names.has(`${prefix} ${ptr}`)) ptr++;
      return `${prefix} ${ptr}`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/public/variables.scss";

section {
  max-width: 35em;
  margin: auto;
}
ul {
  display: flex;
  flex-direction: column;
  width: max-content;
}
li {
  list-style: none;
  margin-left: 0;
}
.category {
  background-color: $color-5;
  padding: 0.5em;
  margin-bottom: 0.5em;
  border-radius: 0.5em;
  display: flex;
  gap: 2em;
  align-items: center;
  transition: 0.1s;
}
.category-actions {
  margin-left: auto;
}
#add-category {
  margin-bottom: 0.5em;
}
#categories-list,
#subcategories-list {
  margin-left: 0;
}
.animate {
  transition: 0.2s;
}
</style>