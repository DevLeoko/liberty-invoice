<script lang="ts">
	import {
		createProductCreateMutation,
		createProductDeleteMutation,
		createProductUpdateMutation,
	} from '../../controller/product'
	import type { CreateProduct } from '../../trpcClient'
	import type { EditorSelection } from '../basics/EditorModal.svelte'
	import EditorModal from '../basics/EditorModal.svelte'
	import ProductEditor from './ProductEditor.svelte'

	export let selected: EditorSelection<CreateProduct> = null

	const updateProduct = createProductUpdateMutation()
	const createProduct = createProductCreateMutation()
	const deleteProduct = createProductDeleteMutation()

	async function onSave() {
		if (selected) {
			if (selected.id === undefined) {
				await createProduct(selected.entity)
			} else {
				await updateProduct({ id: selected.id, product: selected.entity })
			}
		}
	}

	async function onDelete() {
		if (selected && selected.id !== undefined) {
			await deleteProduct(selected.id)
		}
	}
</script>

<EditorModal editor={ProductEditor} name="productEditorModal" bind:selected {onSave} {onDelete} />
