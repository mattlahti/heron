const PI = Math.PI;
const TWO_PI = PI * 2;
const HALF_PI = PI / 2;
const PI_OVER_180 = PI / 180;

function get_error_info(error) {
    let split = error.stack.split("\n")[1].split("@");
    let call = split[0].trim();
    let full_file = split[1].substring(0, split[1].length - 1).trim();
    let file = full_file.substring(full_file.lastIndexOf("/") + 1);

    return {
        full_file: full_file,
        file: file,
        call: call
    };
}

function assert(expression, message) {
    if (!expression) {
        let error_info = get_error_info(new Error()); 
        message = message ? message : "n/a";

        let console_message = "Assertion failed!\n";
        console_message += "File: %o \n";
        console_message += "Function: " + error_info.call + "\n";
        console_message += "Message: " + message;
        
        console.error(console_message, error_info.full_file);

        let confirm_message = "Assertion failed!\n";
        confirm_message += "File: " + error_info.file + "\n";
        confirm_message += "Function: " + error_info.call + "\n";
        confirm_message += "Message: " + message + "\n\n";
        confirm_message += "Press OK to reload the page.";

        if (window.confirm(confirm_message)) {
            window.location.reload(true);
        }

        throw new Error("Exeuction halted due to an assertion failure");
    }
}

window.assert = assert;

function crash_on_default_case_reach() 
{
    console.error("Default case reached.");
}

// Inclusive bound, return boolean
function in_bounds(number, lower, higher) 
{
    return number >= lower && number <= higher;
}

function degrees_to_radians(degrees)
{
    return degrees * PI_OVER_180;
}

function sine(theta) 
{
    return Math.sin(theta);
}

function cosine(theta)
{
    return Math.cos(theta);
}

function tangent(theta)
{
    return Math.tan(theta);
}

function is_power_of_2(value) {
	return (value & (value - 1)) == 0;
}

function deep_copy(object)
{
    return JSON.parse(JSON.stringify(object));
}

//@todo(Matt): atan, asin, acos