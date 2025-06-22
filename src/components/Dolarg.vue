<template>
	<div v-if="dolargPending || initializing">
		<div class="flex justify-end mt-4">
			<div class="card skeleton h-18 w-58"></div>
		</div>
		<div class="card skeleton h-32 w-full mt-4"></div>
		<div class="card skeleton h-32 w-full mt-4"></div>
		<div class="card skeleton h-32 w-full mt-4"></div>
	</div>
	<article v-else>
		<section class="mt-4">
			<div v-if="!dolarg" role="alert" class="alert">
				<svg class="shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
					<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
					<path d="M12 9h.01" />
					<path d="M11 12h1v4h1" />
				</svg>
				<span>Datos no disponibles</span>
			</div>
			<div v-else>
				<div class="flex justify-end mb-4">
					<div class="card card-xs w-58 bg-base-200 border border-base-300">
						<div class="card-body p-4">
							<div class="flex items-center justify-between gap-4">
								<div>
									<h2 class="card-title">Última actualización</h2>
									<p>{{ getStringDate(dolarg.syncDate) }}</p>
								</div>
								<div class="inline-grid *:[grid-area:1/1]">
									<div class="status animate-ping" :class="{ 'status-error': dolarg.syncError, 'status-success': !dolarg.syncError }"></div>
									<div class="status status-error" :class="{ 'status-error': dolarg.syncError, 'status-success': !dolarg.syncError }"></div>
								</div>
							</div>
							<button
								v-if="showUpdateButton(dolarg.syncDate)"
								class="btn btn-block btn-xs btn-primary"
								:disabled="isUpdatingData"
								@click="updateData()"
							>
								Actualizar
							</button>
						</div>
					</div>
				</div>
				<section
					v-for="item in dolarg.data" :key="item.id"
					class="relative mb-6"
				>
					<div class="absolute -bottom-3 left-3 z-1">
						<div class="badge badge-primary uppercase font-bold">{{ item.name }}</div>
					</div>
					<div
						class="stats flex w-full bg-base-200 border border-base-300"
					>
						<div class="stat w-1/2">
							<div class="stat-title">Compra</div>
							<div class="stat-value text-lg sm:text-3xl">{{ item.buyPrice }}</div>
							<div class="stat-desc h-6 flex items-end"></div>
						</div>
						<div class="stat w-1/2">
							<div class="stat-title">Venta</div>
							<div class="stat-value text-lg sm:text-3xl">{{ item.sellPrice }}</div>
							<div
								class="stat-desc font-medium h-6 flex items-end"
								:class="{ 'text-green-700': item.sellPercentageFormated >= 0, 'text-red-500': item.sellPercentageFormated < 0 }"
							>
								{{ item.sellPercentage }}
							</div>
						</div>
					</div>
				</section>
				<!-- <div
					v-for="item in dolarg.data" :key="item.id"
					class="card flex-row items-center bg-base-200 p-4 mb-4"
				>
					<p class="sm:min-w-36">
						<span class="font-medium text-sm uppercase">{{ item.name }}</span>
					</p>
					<div class="grow">
						<div class="flex flex-wrap justify-center">
							<div v-if="item.buyPrice" class="text-center">
								<p><small class="text-xs">Compra</small></p>
								<p class="font-medium text-primary tracking-wider text-xl min-w-28">{{ item.buyPrice }}</p>
								<p class="h-6 align-middle"></p>
							</div>
							<div v-if="item.buyPrice" class="divider sm:divider-horizontal w-full sm:w-auto mx-8 sm:mx-12"></div>
							<div class="text-center">
								<p><small class="text-xs">Venta</small></p>
								<p class="font-medium text-primary tracking-wider text-xl min-w-28">{{ item.sellPrice }}</p>
								<p class="h-6 align-middle">
									<small
										v-if="item.sellPercentage"
										class="font-medium text-xs"
										:class="{ 'text-green-700': item.sellPercentageFormated >= 0, 'text-red-500': item.sellPercentageFormated < 0 }"
									>
										{{ item.sellPercentage }}
									</small>
								</p>
							</div>
						</div>
					</div>
				</div> -->
			</div>
			<!-- <div class="fixed bottom-0 left-0 w-full z-[1000]">
				<div class="max-w-5xl mx-auto p-4 pb-0">
					<div class="card navbar rounded-b-none flex-row bg-base-300/40 backdrop-blur-md justify-end gap-2">
						<button class="btn btn-soft btn-circle" aria-label="Volver al principio" @click="goTop">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
								<path d="M6 15l6 -6l6 6" />
							</svg>
						</button>
					</div>
				</div>
			</div> -->
		</section>
	</article>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useDocument } from 'vuefire';
import { doc } from 'firebase/firestore';
import { db } from '@fb/client';

const initializing = ref(true);
const isUpdatingData = ref(false);

const {
  data: dolarg,
  pending: dolargPending,
  error: dolargError,
} = useDocument(doc(db, 'dolarg', import.meta.env.PUBLIC_FIREBASE_DOLARG_DOC_ID));

onMounted(() => {
  setTimeout(() => (initializing.value = false), 1000);
});

function getStringDate(timestamp) {
	const date = timestamp && typeof timestamp.toDate === 'function'
		? timestamp.toDate()
		: null;

	if (!date) return 'Sin fecha';

	let minutes = date.getMinutes();
	minutes = minutes < 10 ? `0${minutes}` : minutes;
	return `${date.toLocaleDateString()} ${date.getHours()}:${minutes}`;
}

function showUpdateButton(timestamp) {
	if (!timestamp) return true;

	const COOLDOWN_PERIOD_MS = 10 * 60 * 1000
	const date = timestamp.toDate();
	const now = new Date();

	if ((now.getTime() - date.getTime()) < COOLDOWN_PERIOD_MS) return false;
	return true;
}

function updateData() {
	isUpdatingData.value = true;
	fetch(import.meta.env.PUBLIC_COMMANDER_DOLARG_URL, {
		method: 'POST',
		headers: {
			'X-API-KEY': import.meta.env.PUBLIC_COMMANDER_API_KEY
		}
	})
	.then(_ => (isUpdatingData.value = false))
	.catch(_ => (isUpdatingData.value = false));
}

function goTop() {
	window && window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>
