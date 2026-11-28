<script setup>
import { ref, computed } from 'vue';

const date = ref(new Date());
const selectedDate = ref(null);

const days = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
const months = [
    'Leden', 'Únor', 'Březen', 'Duben',
    'Květen', 'Červen', 'Červenec', 'Srpen',
    'Září', 'Říjen', 'Listopad', 'Prosinec'
];

const monthTitle = computed(() => {
    const year = date.value.getFullYear();
    const month = date.value.getMonth();

    return `${months[month]} ${year}`;
});

const calendarDays = computed(() => {
    const year = date.value.getFullYear();
    const month = date.value.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const start = (firstDay.getDay() + 6) % 7;

    const calendar = [];

    for(let i = 0; i < start; i++) {
        calendar.push(null);
    }

    for(let day = 1; day < daysInMonth; day++) {
        calendar.push(day);
    }

    return calendar;
});

function previousMonth() {
    const date2 = date.value;

    date.value = new Date(date2.getFullYear(), date2.getMonth() - 1, 1);
    selectedDate.value = null;
}

function nextMonth() {
    const date2 = date.value;

    date.value = new Date(date2.getFullYear(), date2.getMonth() + 1, 1);
    selectedDate.value = null;
}

function selectDay(day) {
    if(day !== null) {
        selectedDate.value = day;
    }
}
</script>

<template>
    <section class="calendar">
        <div class="calendar-top">

            <div class="calendar-nav">
                <button @click="previousMonth" type="button"> &#10094; </button>
                <h3>{{ monthTitle }}</h3>
                <button @click="nextMonth" type="button"> &#10095; </button>
            </div>

            <button class="calendar-add-btn" type="button"> + Vytvořit upomínku </button>
        </div>

        <div class="calendar-grid">
            <div v-for="day in days" :key="day" class="calendar-week">
                {{ day }}
            </div>

            <div v-for="(day, index) in calendarDays" :key="index" class="calendar-cell">
                <button
                    v-if="day !== null"
                    type="button"
                    class="calendar-day"
                    :class="{'selected-day': selectedDate === day}"
                    @click="selectDay(day)"
                >
                    {{ day }}
                </button>
            </div>
        </div>
    </section>
</template>