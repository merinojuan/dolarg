<template>
	<div v-if="dolargPending || othersPending || initializing">
		<div class="flex justify-center mt-4">
			<div class="card skeleton rounded-full h-12 w-36"></div>
		</div>
		<div class="card skeleton h-32 w-full mt-4"></div>
		<div class="card skeleton h-32 w-full mt-4"></div>
		<div class="card skeleton h-32 w-full mt-4"></div>
		<div class="flex justify-end mt-6 mb-6">
			<div class="card skeleton h-18 w-58"></div>
		</div>
	</div>
	<article v-else>
		<section class="mt-4">
			<div class="flex justify-center mb-4">
				<div class="tabs tabs-box">
					<input type="radio" name="dolar" class="tab" aria-label="Dólar" :checked="viewSection === 'dolarg'" @click="changeViewSection('dolarg')" />
					<input type="radio" name="otros" class="tab" aria-label="Otros" :checked="viewSection === 'others'" @click="changeViewSection('others')" />
				</div>
			</div>
			<section v-if="viewSection === 'dolarg'">
				<div v-if="!dolarg" role="alert" class="alert">
					<svg class="shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
						<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
						<path d="M12 9h.01" />
						<path d="M11 12h1v4h1" />
					</svg>
					<span>Datos no disponibles</span>
				</div>
				<div v-else>
					<div
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
								>
									<span
										v-if="item.sellPercentageFormated !== null"
										:class="{ 'text-green-700': item.sellPercentageFormated > 0, 'text-red-500': item.sellPercentageFormated < 0 }"
									>
										{{ numFormatter(item.sellPercentageFormated) + '%' }}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div class="flex justify-end mb-6">
						<div class="card card-xs w-58 bg-base-200 border border-base-300">
							<div class="card-body p-4">
								<div class="flex items-center justify-between gap-4">
									<div>
										<h2 class="card-title">Última actualización</h2>
										<p>{{ getStringDate(dolarg.syncDate) }}</p>
									</div>
									<div v-if="isUpdatingData" class="status status-warning animate-bounce"></div>
									<div v-else class="inline-grid *:[grid-area:1/1]">
										<div class="status animate-ping" :class="{ 'status-error': dolarg.syncError, 'status-success': !dolarg.syncError }"></div>
										<div class="status status-error" :class="{ 'status-error': dolarg.syncError, 'status-success': !dolarg.syncError }"></div>
									</div>
								</div>
								<!-- <button
									v-if="showUpdateButton(dolarg.syncDate)"
									class="btn btn-block btn-xs btn-primary"
									:disabled="isUpdatingData"
									@click="updateData()"
								>
									Actualizar
								</button> -->
							</div>
						</div>
					</div>
				</div>
			</section>
			<section v-if="viewSection === 'others'" class="mt-2">
				<div v-if="!others" role="alert" class="alert">
					<svg class="shrink-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
						<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
						<path d="M12 9h.01" />
						<path d="M11 12h1v4h1" />
					</svg>
					<span>Datos no disponibles</span>
				</div>
				<div v-else>
					<div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
						<template v-for="item in others.data" :key="item.id">
							<div v-if="!!item.name && !item.name.includes('Dólar')">
								<div
									class="stats flex w-full bg-base-200 border border-base-300"
								>
									
										<div class="stat">
											<div class="flex items-center gap-3">
												<div class="grow">
													<div class="stat-title">
														{{ item.name }}
													</div>
													<div class="stat-value text-2xl sm:text-3xl">
														<span v-if="item.value !== null">{{ '$' + numFormatter(item.value) }}</span>
														<span v-else>-</span>
													</div>
													<div class="stat-desc h-6 flex items-end">
														<span
															v-if="item.variation !== null"
															:class="{ 'text-green-700': item.variation > 0, 'text-red-500': item.variation < 0 }"
														>
															{{ numFormatter(item.variation) + '%' }}
														</span>
													</div>
												</div>
												<span class="text-3xl">{{ item.emoji }}</span>
											</div>
											
										</div>
									
								</div>
							</div>
						</template>
					</div>
					<div class="flex justify-end mb-6 mt-6">
						<div class="card card-xs w-58 bg-base-200 border border-base-300">
							<div class="card-body p-4">
								<div class="flex items-center justify-between gap-4">
									<div>
										<h2 class="card-title">Última actualización</h2>
										<p>{{ getStringDate(others.syncDate) }}</p>
									</div>
									<div class="inline-grid *:[grid-area:1/1]">
										<div class="status animate-ping" :class="{ 'status-error': others.syncError, 'status-success': !others.syncError }"></div>
										<div class="status status-error" :class="{ 'status-error': others.syncError, 'status-success': !others.syncError }"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
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
import { onMounted, ref, watch } from 'vue';
import { useDocument } from 'vuefire';
import { doc } from 'firebase/firestore';
import { db } from '@fb/client';

const initializing = ref(true);
const isUpdatingData = ref(false);
const viewSection = ref('dolarg');

const {
  data: dolarg,
  pending: dolargPending,
  error: dolargError,
} = useDocument(doc(db, 'dolarg', import.meta.env.PUBLIC_FIREBASE_DOLARG_DOC_ID));

const {
  data: others,
  pending: othersPending,
  error: othersError,
} = useDocument(doc(db, 'dolarg', import.meta.env.PUBLIC_FIREBASE_DOLARG_OTHERS_DOC_ID));

onMounted(() => {
  setTimeout(() => (initializing.value = false), 1000);
});

watch(dolarg, (dolargData) => {
  if (dolargData && showUpdateButton(dolargData.syncDate)) updateData();
}, { immediate: true });

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
	if (!timestamp) return false;

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

function changeViewSection(section) {
	viewSection.value = section;
}

function numFormatter(num) {
	return new Intl.NumberFormat('es-ES').format(num);
}

function goTop() {
	window && window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>
