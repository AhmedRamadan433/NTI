const bookedSlots = ["a1", "b3"];

function bookAppointment(slot) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (bookedSlots.includes(slot)) {
        reject("This slot is already booked.");
      } else {
        resolve("Appointment booked successfully.");
      }
    }, 2000);
  });
}

async function reserve(slot) {
  try {
    const result = await bookAppointment(slot);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}
reserve("c2");
reserve("a1");
