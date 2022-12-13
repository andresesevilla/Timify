<template>
  <section v-if="categories !== null" class="animate">

    <b-button class="is-primary" id="add-category" @click="addCategory">Add category</b-button>
    <ul v-if="categories.length" id="categories-list">
      <li v-for="category in categories" :key="category.id" class="category">
        <span v-if="editing !== category">{{ category.name }}</span>
        <b-input v-else v-model="draft.name" v-on:keyup.native.enter="saveEdit(category)"></b-input>
        <span class="category-actions" v-if="!editing">
          <b-tooltip label="Edit"><a @click="startEdit(category)"><b-icon icon="pencil" style="color: #087f5b" /></a></b-tooltip>
          <b-tooltip label="Delete"><a @click="deleteCategory(category)"><b-icon icon="delete" style="color: #000" /></a></b-tooltip>
        </span>
        <span class="category-actions" v-else-if="editing === category">
          <b-tooltip label="Save"><a @click="saveEdit(category)"><b-icon icon="check" style="color: #087f5b" /></a></b-tooltip>
          <b-tooltip label="Cancel"><a @click="discardEdit(category)"><b-icon icon="close" style="color: #000" /></a></b-tooltip>
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
      isLoading: true,
      lastActionMethod: null,
    };
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    fetchCategories() {
      if (!this.$store.state.categories) {
        fetch("/api/categories")
          .then((response) => response.json())
          .then((categories) => {
            this.categories = categories;
            this.$store.commit("setCategories", [...categories]);
          });
      } else {
        this.categories = [...this.$store.state.categories];
      }
    },
    addCategory() {
      if (this.editing) {
        this.$buefy.toast.open({
          message: "Finish editing the category you're currently editing first.",
          type: "is-warning",
          position: "is-bottom",
          duration: 3000,
        });
        return;
      }
      this.categories.unshift({ name: this.getUniqueName("Category") });
      this.lastActionMethod = "POST";
      this.startEdit(this.categories[0]);
    },
    startEdit(category) {
      if (!this.lastActionMethod) {
        this.lastActionMethod = "PATCH";
      }
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
      // make patch request to /api/categories/category.name and send draft name in the body
      if (this.lastActionMethod !== "POST" && category.name === this.draft.name) {
        this.$buefy.toast.open({
          message: "No changes made.",
          type: "is-warning",
          duration: 1000,
        });
        this.discardEdit(category);
        return;
      }
      const url = this.lastActionMethod === "POST" ? "/api/categories" : `/api/categories/${category.name}`;
      fetch(url, {
        method: this.lastActionMethod,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.draft),
      }).then(res => res.json()).then(res => {
        if (res.error) {
          this.$buefy.toast.open({
            message: res.error,
            type: "is-danger",
            duration: 3000,
          });
        } else {
          this.$buefy.toast.open({
            message: res.message,
            type: "is-success",
            duration: 2000,
          });
          this.editing = null;
          this.categories[this.categories.indexOf(category)] = this.draft;
          this.lastActionMethod = null;
          this.$emit("update-categories");
        }
      });
    },
    discardEdit(category) {
      if (this.lastActionMethod === "POST") {
        this.categories.splice(this.categories.indexOf(category), 1);
      }
      this.editing = null;
      this.draft = {};
    },
    deleteCategory(category) {
      this.$buefy.dialog.confirm({
        title: "Deleting category",
        message:
          "Are you sure you want to delete this category? It will also remove all the time logs and goals associated with it.",
        confirmText: "Delete category",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => {
          fetch(`/api/categories/${category.name}`, {
            method: "DELETE",
          }).then(res => res.json()).then(res => {
            if (res.error) {
              this.$buefy.toast.open({
                message: res.error,
                type: "is-danger",
                duration: 3000,
              });
            } else {
              this.$buefy.toast.open({
                message: res.message,
                type: "is-success",
                duration: 2000,
              });
              this.$emit("update-categories");
              this.categories.splice(this.categories.indexOf(category), 1);
            }
          });
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
  background-color: $oc-gray-1;
  border: 2px solid $oc-gray-4;
  font-weight: 600;
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
  // change icons to primary color
  svg {
    fill: $primary;
  }
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