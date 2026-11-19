
const parkingForm = document.getElementById("parkingForm");

const vehicleNo = document.getElementById("vehicle_no");
const vehicleType = document.getElementById("vehicle_type");
const entryTime = document.getElementById("entry_time");
const exitTime = document.getElementById("exit_time");

const result = document.getElementById("result");
const feeDetails = document.getElementById("fee_details");

const parkingRates = {
    bike: { firstHour: 50, additionalHour: 30 },
    car: { firstHour: 100, additionalHour: 50 },
    van: { firstHour: 150, additionalHour: 75 },
    bus: { firstHour: 200, additionalHour: 100 }
};

function calculateParkingFee() {

    const number = vehicleNo.value.trim().toUpperCase();
    const type = vehicleType.value;

    const entry = new Date(entryTime.value);
    const exit = new Date(exitTime.value);

    let isValid = true;

    document.querySelectorAll("#parkingForm .form-control, #parkingForm .form-select")
        .forEach(field => {
            field.classList.remove("is-invalid", "is-valid");
        });

    if (number === "") {
        vehicleNo.classList.add("is-invalid");
        isValid = false;
    } else {
        vehicleNo.classList.add("is-valid");
    }

    if (type === "") {
        vehicleType.classList.add("is-invalid");
        isValid = false;
    } else {
        vehicleType.classList.add("is-valid");
    }

    if (entryTime.value === "") {
        entryTime.classList.add("is-invalid");
        isValid = false;
    } else {
        entryTime.classList.add("is-valid");
    }

    if (exitTime.value === "") {
        exitTime.classList.add("is-invalid");
        isValid = false;
    } else {
        exitTime.classList.add("is-valid");
    }

    if (!isValid) {
        result.classList.add("d-none");

        Swal.fire({
            icon: "warning",
            title: "Missing Information",
            text: "Please fill in all required fields.",
            confirmButtonColor: "#16845B"
        });

        return;
    }

    const vehiclePattern = /^[A-Z0-9-]{3,15}$/;

    if (!vehiclePattern.test(number)) {
        vehicleNo.classList.remove("is-valid");
        vehicleNo.classList.add("is-invalid");

        result.classList.add("d-none");

        Swal.fire({
            icon: "error",
            title: "Invalid Vehicle Number",
            text: "Please enter a valid vehicle number.",
            confirmButtonColor: "#16845B"
        });

        return;
    }

    const difference = exit.getTime() - entry.getTime();

    if (!Number.isFinite(difference) || difference <= 0) {
        exitTime.classList.remove("is-valid");
        exitTime.classList.add("is-invalid");

        result.classList.add("d-none");

        Swal.fire({
            icon: "error",
            title: "Invalid Date & Time",
            text: "Exit date and time must be after entry date and time.",
            confirmButtonColor: "#16845B"
        });

        return;
    }

    const hours = Math.ceil(difference / (1000 * 60 * 60));

    const rates = parkingRates[type];

    let total;

    if (hours <= 1) {
        total = rates.firstHour;
    } else {
        total = rates.firstHour + (hours - 1) * rates.additionalHour;
    }

    const durationHours = Math.floor(difference / 3600000);

    const durationMinutes = Math.floor(
        (difference % 3600000) / 60000
    );

    feeDetails.innerHTML = `
        <div class="row g-3 mb-4">

            <div class="col-6">
                <div class="p-3 rounded-3 h-100" style="background-color: #E7EFE7;">
                    <small class="text-secondary">Vehicle Number</small>
                    <h6 class="fw-bold mt-2 mb-0">${number}</h6>
                </div>
            </div>

            <div class="col-6">
                <div class="p-3 rounded-3 h-100" style="background-color: #E7EFE7;">
                    <small class="text-secondary">Vehicle Type</small>
                    <h6 class="fw-bold mt-2 mb-0">${type.toUpperCase()}</h6>
                </div>
            </div>

            <div class="col-6">
                <div class="p-3 rounded-3 h-100" style="background-color: #E7EFE7;">
                    <small class="text-secondary">Parking Duration</small>
                    <h6 class="fw-bold mt-2 mb-0">
                        ${durationHours}h ${durationMinutes}m
                    </h6>
                </div>
            </div>

            <div class="col-6">
                <div class="p-3 rounded-3 h-100" style="background-color: #E7EFE7;">
                    <small class="text-secondary">Charged Hours</small>
                    <h6 class="fw-bold mt-2 mb-0">${hours} hour(s)</h6>
                </div>
            </div>

        </div>

        <div class="rounded-4 p-4 text-center text-white"
             style="background-color: #16845B;">

            <small class="fw-semibold text-white-50">
                TOTAL PARKING FEE
            </small>

            <h2 class="fw-bold mt-2 mb-0">
                Rs. ${total.toLocaleString("en-LK")}
            </h2>

            <small class="text-white-50">
                Thank you for using ParkSmart
            </small>

        </div>
    `;

    result.classList.remove("d-none");

    Swal.fire({
        icon: "success",
        title: "Calculation Successful!",
        text: "Parking fee calculated successfully.",
        confirmButtonText: "View Details",
        confirmButtonColor: "#16845B"
    }).then(() => {
        result.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });
}

parkingForm.addEventListener("submit", function(event) {
    event.preventDefault();
    calculateParkingFee();
});

parkingForm.addEventListener("reset", function() {

    setTimeout(() => {

        document.querySelectorAll("#parkingForm .form-control, #parkingForm .form-select")
            .forEach(field => {
                field.classList.remove("is-invalid", "is-valid");
            });

        result.classList.add("d-none");
        feeDetails.innerHTML = "";

    }, 0);
});
