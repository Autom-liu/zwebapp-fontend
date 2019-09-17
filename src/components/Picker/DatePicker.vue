<template>
	<multiPicker
		:is-show.sync="show"
		:columns="columns"
		:key-field="keyField"
		:label-field="labelField"
		:default-current="defaultCurrent"
		@column-change="onColumnChange"
	>
		<template slot-scope="props">
			<p>{{props}}</p>
		</template>
	</multiPicker>
</template>

<script>
import MultiPicker from './MultiPicker';
export default {
	props: {
		isShow: {
			type: Boolean,
			default: false,
		},
		minDate: {
			type: Date,
			default: () => new Date('1870-01-01 00:00:00'),
		},
		maxDate: {
			type: Date,
			default: () => new Date('2050-12-31 23:59:59'),
		},
	},
	data() {
		return {
			show: false,
			columns: [[], [], []],
			keyField: 'key',
			labelField: 'label',
			now: new Date(),
			defaultYearIndex: 0,
			defaultMonthIndex: 0,
			defaultDayIndex: 0,
			defaultCurrent: [],
			dayMap: {
				1: 31,
				2: 28,
				3: 31,
				4: 30,
				5: 31,
				6: 30,
				7: 31,
				8: 31,
				9: 30,
				10: 31,
				11: 30,
				12: 31,
			},
		};
	},
	methods: {
		initYear() {
			const minYear = this.minDate.getFullYear();
			const maxYear = this.maxDate.getFullYear();
			const arr = [];
			// eslint-disable-next-line no-plusplus
			for (let y = minYear; y <= maxYear; y++) {
				arr.push({ key: y, label: `${y}年` });
				if (y === this.now.getFullYear()) {
					this.defaultYearIndex = y - minYear;
				}
			}
			return arr;
		},
		initMonth() {
			const arr = [];
			// eslint-disable-next-line no-plusplus
			for (let m = 1; m <= 12; m++) {
				arr.push({ key: m, label: `${m}月` });
				if (m === this.now.getMonth() + 1) {
					this.defaultMonthIndex = m - 1;
				}
			}
			return arr;
		},
		initDay() {
			const day = [];
			// eslint-disable-next-line no-plusplus
			for (let d = 1; d <= 31; d++) {
				day.push({ key: d, label: `${d}日` });
				if (d === this.now.getDate()) {
					this.defaultDayIndex = d - 1;
				}
			}
			return day;
		},
		onColumnChange(p, i) {
			if (i === 0) {
				// 年变化，刷新月和日
				const year = this.columns[i][p[i]].key;
				this.$set(this.columns, 1, this.getMonthRange(year));
			}
		},
		getMonthRange(year) {
			const arr = [];
			const minMonth = year === this.minDate.getFullYear() ? this.minDate.getMonth() + 1 : 1;
			const maxMonth = year === this.maxDate.getFullYear() ? this.maxDate.getMonth() + 1 : 12;
			// eslint-disable-next-line no-plusplus
			for (let m = minMonth; m <= maxMonth; m++) {
				arr.push({ key: m, label: `${m}月` });
			}
			return arr;
		},
		getDayRange(year, month) {

		},
	},
	mounted() {
		this.columns = [this.initYear(), this.initMonth(), this.initDay()];
		this.defaultCurrent = [this.defaultYearIndex, this.defaultMonthIndex, this.defaultDayIndex];
	},
	components: {
		MultiPicker,
	},
	watch: {
		isShow(val) {
			this.show = val;
		},
		show(val) {
			this.$emit('update:isShow', val);
		},
	},
};
</script>

<style>

</style>
