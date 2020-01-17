/*
░░░░░░░░░░░░▄▄▄███████████████████▄▄▄▄
░░░░░░░░▄█████████████████████████████████▄
░░░░░░▄██████████████████████████████████████▄
░░░░▄██████████████████████████████████████████▄
░░███████████████████████████████████████████████
░█████████████████████████████████████████████████▄
░██████████████████████████████████████████████████▄
██████░░████████░░░▀▀▀▀█████████████████████████████
██████░░██████▀██▀░░░░░░░░░░░▀███████████████████████▄
░▀█████▄██████▄░░░░░░▄▄███████▄▄▄▄▄░▀██████████████▀▀
░░███████████░░░░░░░▀▀███████████▀▀░░███▀░░▀███████
░░█▀▀▄▄▄▄▄▄██░░░░░░░░░░░▄▄▄▄▄▄▄▄▄░░░▄███▄██▄░█████
░░█▄█▄▀█▄▀▀███░░░░▄░░░░█▀▄█▀█▄░░▀█░░███░▀▀██░▀████
░░█▀██▀▄▀▄▄███░░░░▄░░░██▄▀▄▀▄▀░░▄█▀░██▀░▄█▀░▄████
░░█░░▀▀▀▀░░███░░░░█▄░░░░▀▀▀▀▀▀▀▀▀░▄███▄██░███████
░░██░░░░░░░███░░░░▀██▄░░░░░░░░░░░░███████░░██████
░███░░░░░░░██▀░░░░░█▀▄░░░░░░░░░░░░██████▄▄████████
░███░░░░▄░▄██░░░░░░░░█▄░░░▄░░░░░░░█████░█▀▀███████
░███░░░▄█▄██▄▄▄░░▄▄▄▄██▄▄▄█▄░░░░░░████░▄█░░███████
▄████░██████████████████████▄░░░░░████░██░████████▄
█████░███████████████████████░░░░░███░░██░█████████
██████████▀▀▀░░▀▀░░░▀▀▀▀█████▄░░░░░██░██░░████████
░▀██████████▀█▀█▀█▀█▀█▀█░██████░░░░░░▄██████████▀
░░░░█████░░▀▀▀▀▀▀▀▀▀▀▀▀░░█████░░░░░▄██▀▀░░░░▀▀
░░░░░████░░▄▄▄▄▄▄▄▄▄▄▄▄░░█████░░░░▄█▀
░░░░░░▀██░░░░░░░░░░░░░░░█████░░░░█▀
░░░░░░░▀█▄░░░░░░░░░░░░░░████████▀
░░░░░░░░░▀▀▄▄▄▄▄▄▄▄▄▄▄▄▄█▀▀▀▀▀▀
*/

// Vector Classes

class vector 
{
    print(name, decimal_places) 
    {
        console.log(this.to_string(name, decimal_places));
    }

    to_string(name, decimal_places)
    {
        let output_string = `v${this.size}`

        if (name) 
        {
            output_string += ` ${name}`;
        }

        output_string += `: (`;

        for (let i = 0; i < this.size; i++) 
        {
            if (decimal_places !== undefined) 
            {
                output_string += this.e[i].toFixed(decimal_places);
            }
            else 
            {
                output_string += Math.round(this.e[i]);
            }

            output_string += i != (this.size - 1) ? ", " : ")";
        }
    
        return output_string;
    }

    update_e_from_properties()
    {
        switch (this.size) 
        {
            case 2:
            {
                this.e[0] = this.x;
                this.e[1] = this.y;

                break;
            }
            case 3:
            {
                this.e[0] = this.x;
                this.e[1] = this.y;
                this.e[2] = this.z;

                break;
            }
            case 4:
            {
                this.e[0] = this.x;
                this.e[1] = this.y;
                this.e[2] = this.z;
                this.e[3] = this.w;

                break;
            }
            default: crash_on_default_case_reach();
        }
    }

    update_properties_from_e() 
    {
        assert(in_bounds(this.e.length, 2, 4));

        switch (this.e.length) 
        {
            case 2:
            {
                this.x = this.e[0];
                this.y = this.e[1];

                break;
            }
            case 3:
            {
                this.x = this.e[0];
                this.y = this.e[1];
                this.z = this.e[2];

                break;
            }
            case 4:
            {
                this.x = this.e[0];
                this.y = this.e[1];
                this.z = this.e[2];
                this.w = this.e[3];

                break;
            }
            default: crash_on_default_case_reach();
        }
    }

    negate() 
    {
        for (let i = 0; i < this.size; i++) 
        {
            this.e[i] = -this.e[i];
        }

        this.update_properties_from_e();
    }

    normalize()
    {
        return this.get_length_squared() > 0 ? vector_divide(this, this.get_length()) : make_empty_vector(this.size);
    }

    get_length_squared() 
    {
        return dot(this, this);
    }

    get_length()
    {
        return Math.sqrt(this.get_length_squared());
    }

    to_matrix() 
    {
        let result = null;

        switch (this.size) 
        {
            case 2: 
            {
                result = new m2x2(
                    this.x, 0.0,
                    this.y, 0.0
                );

                break;
            }
            case 3:
            {
                result = new m3x3(
                    this.x, 0.0, 0.0,
                    this.y, 0.0, 0.0,
                    this.z, 0.0, 0.0
                );

                break;
            }
            case 4:
            {
                result = new m4x4(
                    this.x, 0.0, 0.0, 0.0,
                    this.y, 0.0, 0.0, 0.0,
                    this.z, 0.0, 0.0, 0.0,
                    this.w, 0.0, 0.0, 0.0
                );

                break;
            }
            default: crash_on_default_case_reach();
        }

        return result;
    }
}

class v2 extends vector 
{
    constructor(x, y) 
    {
        super();

        this.x = x;
        this.y = y;

        this.e = [ x, y ];

        this.size = 2;
    }
}

class v3 extends vector 
{
    constructor(x, y, z) 
    {        
        super();

        this.x = x;
        this.y = y;
        this.z = z;

        this.e = [ x, y, z ];

        this.size = 3;
    }

    get_size() 
    {
        return this.e.length;
    }

    to_v4(w)
    {
        return make_v4(this.x, this.y, this.z, w || 1.0);
    }
}

class v4 extends vector 
{
    constructor(x, y, z, w) 
    {
        super();

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        this.e = [ x, y, z, w ];

        this.size = 4;
    }
    to_v3() 
    {
        return make_v3(this.x, this.y, this.z);
    }
}

// Matrix Classes

class matrix 
{
    print(name, decimal_places)
    {
        console.log(this.to_string(name, decimal_places));
    }

    to_string(name, decimal_places) 
    {
        let row_size = this.f.length;
        let column_size = this.f[0].length;
        let output_string = "";
        let column_max_lengths = [];
        let row_index = 0;
        let column_index = 0;
        let decimals = 2;
    
        //@note(Matt): Have to explicitly check undefined, when decimal_places = 0, !decimal_places is true
        if (decimal_places !== undefined) {
            decimals = decimal_places;
        }
    
        if (name) {
            output_string += `${name}: \n`;
        }
    
        for (; column_index < column_size - 1; column_index++) {
            let longest_number_digit_length = 0;
    
            for (row_index = 0; row_index < row_size; row_index++) {
                let digit_length = this.f[row_index][column_index].toFixed(decimals).length;
    
                if (digit_length > longest_number_digit_length) {
                    longest_number_digit_length = digit_length;
                }
            }
    
            column_max_lengths[column_index] = longest_number_digit_length;
        }
    
        for (row_index = 0; row_index < row_size; row_index++) {
            for (column_index = 0; column_index < column_size; column_index++) {
                let number = this.f[row_index][column_index].toFixed(decimals);
                let digit_length = number.toString().length;
                
                output_string += number;
    
                for (let space_index = digit_length; space_index < column_max_lengths[column_index]; space_index++) {
                    output_string += " ";
                }
    
                if (column_index !== (column_size - 1)) {
                    output_string += " | ";
                }
            }
    
            output_string += "\n";
        }
    
        return output_string;
    }

    to_1d_array() 
    {
        let result = [];

        switch (this.size)
        {
            case 2:
            {
                result[0] = this.a0;
                result[1] = this.a1;

                result[2] = this.b0;
                result[3] = this.b1;

                break;
            }
            case 3:
            {
                result[0] = this.a0;
                result[1] = this.a1;
                result[2] = this.a2;
                
                result[3] = this.b0;
                result[4] = this.b1;
                result[5] = this.b2;
                
                result[6] = this.c0;
                result[7] = this.c1;
                result[8] = this.c2;
                
                break;
            }
            case 4:
            {
                result[0] = this.a0;
                result[1] = this.a1;
                result[2] = this.a2;
                result[3] = this.a3;
                
                result[4] = this.b0;
                result[5] = this.b1;
                result[6] = this.b2;
                result[7] = this.b3;

                result[8] = this.c0;
                result[9] = this.c1;
                result[10] = this.c2;
                result[11] = this.c3;

                result[12] = this.d0;
                result[13] = this.d1;
                result[14] = this.d2;
                result[15] = this.d3;
                
                break;
            }
            default: crash_on_default_case_reach();
        }

        return result;
    }
    
    to_2d_array() {
        let result = [];
    
        for (let i = 0; i < this.size; i++) 
        {
            result[i] = [];
    
            for (let j = 0; j < this.size; j++) 
            {
                result[i][j] = this.e[(i * this.size) + j];
            }
        }
    
        return result;
    }
    
    update_properties_from_f() 
    {
        assert(in_bounds(this.f.length, 2, 4));

        this.e = [];

        for (let i = 0; i < this.f.length; i++) 
        {
            for (let j = 0; j < this.f[i].length; j++) 
            {
                this.e.push(this.f[i][j]);
            }
        }

        switch (this.size) 
        {
            case 2:
            {
                this.a0 = this.e[0];
                this.a1 = this.e[1];

                this.b0 = this.e[2];
                this.b1 = this.e[3];

                break;
            }
            case 3: 
            {
                this.a0 = this.e[0];
                this.a1 = this.e[1];
                this.a2 = this.e[2];

                this.b0 = this.e[3];
                this.b1 = this.e[4];
                this.b2 = this.e[5];

                this.c0 = this.e[6];
                this.c1 = this.e[7];
                this.c2 = this.e[8];

                break;
            }
            case 4: 
            {
                this.a0 = this.e[0];
                this.a1 = this.e[1];
                this.a2 = this.e[2];
                this.a3 = this.e[3];

                this.b0 = this.e[4];
                this.b1 = this.e[5];
                this.b2 = this.e[6];
                this.b3 = this.e[7];

                this.c0 = this.e[8];
                this.c1 = this.e[9];
                this.c2 = this.e[10];
                this.c3 = this.e[11];

                this.d0 = this.e[12];
                this.d1 = this.e[13];
                this.d2 = this.e[14];
                this.d3 = this.e[15];

                break;
            }
            default: crash_on_default_case_reach();
        }
    }

    //@todo(Matt): Instead of returning a new matrix here, just apply it to "this" (.call);
    transpose() 
    {
        let result = make_empty_matrix(this.size);

        for (let i = 0; i < this.size; i++)
        {
            for (let j = 0; j < this.size; j++) 
            {
                result.f[i][j] = this.f[j][i];
            }
        }

        result.update_properties_from_f();
        
        return result;
    }

    //@todo(Matt): Need to complete this for normal matrix
    invert()
    {


    }
    
    negate()
    {
        for (let i = 0; i < this.size; i++) 
        {
            for (let j = 0; j < this.size; j++) 
            {
                this.f[i][j] = -this.f[i][j];
            }
        }

        this.update_properties_from_f;
    }

    // Alias for to_vector
    get_column(column_index) 
    {
        assert(column_index < this.size);
        let result = [];

        for (let i = 0; i < this.size; i++) 
        {
            result[i] = this.f[i][column_index];
        }

        return make_vector(result);
    }

    get_row(row_index)
    {
        assert(row_index < this.size);
        let result = [];

        for (let i = 0; i < this.size; i++) 
        {
            result[i] = this.f[row_index][i];
        }

        return result;
    }
}

class m2x2 extends matrix 
{
    constructor(a0, a1, b0, b1) 
    {
        super();
        
        this.a0 = a0;
        this.a1 = a1;

        this.b0 = b0;
        this.b1 = b1;

        this.size = 2;

        this.e = this.to_1d_array();
        this.f = this.to_2d_array();
    }
}

class m3x3 extends matrix 
{
    constructor(a0, a1, a2, b0, b1, b2, c0, c1, c2)
    {
        super();

        this.a0 = a0;
        this.a1 = a1;
        this.a2 = a2;

        this.b0 = b0;
        this.b1 = b1;
        this.b2 = b2;

        this.c0 = c0;
        this.c1 = c1;
        this.c2 = c2;

        this.size = 3;

        this.e = this.to_1d_array();
        this.f = this.to_2d_array();
    }

    to_m4x4() 
    {
        return make_m4x4(
            this.a0, this.a1, this.a2, 0.0,  
            this.b0, this.b1, this.b2, 0.0,  
            this.c0, this.c1, this.c2, 0.0,  
            0.0,     0.0,     0.0,     1.0
        );
    }
}

class m4x4 extends matrix 
{
    constructor(a0, a1, a2, a3, b0, b1, b2, b3, c0, c1, c2, c3, d0, d1, d2, d3) 
    {
        super();
        
        this.a0 = a0;
        this.a1 = a1;
        this.a2 = a2;
        this.a3 = a3;

        this.b0 = b0;
        this.b1 = b1;
        this.b2 = b2;
        this.b3 = b3;

        this.c0 = c0;
        this.c1 = c1;
        this.c2 = c2;
        this.c3 = c3;

        this.d0 = d0;
        this.d1 = d1;
        this.d2 = d2;
        this.d3 = d3;

        this.size = 4;

        this.e = this.to_1d_array();
        this.f = this.to_2d_array();
    }

    to_m3x3()
    {
        return make_m3x3(
            this.a0, this.a1, this.a2,
            this.b0, this.b1, this.b2,
            this.c0, this.c1, this.c2
        );
    }
}

// Vector Constructors

function make_empty_vector(size) 
{
    let result;

    switch (size) 
    {
        case 2: 
        {
            result = new v2(0, 0);
            break;
        }
        case 3: 
        {
            result = new v3(0, 0);
            break;
        }
        case 4:
        {
            result = new v4(0, 0);
            break;
        }
        default: crash_on_default_case_reach();
    }

    return result;
}

function make_v2(x, y) 
{
    return new v2(x, y);
}

function make_v3(x, y, z) 
{
    return new v3(x, y, z);
}

function make_v4(x, y, z, w) 
{
    return new v4(x, y, z, w);
}

function make_vector(values) 
{
    let vector_size = values.length;
    assert(in_bounds(vector_size, 2, 4));

    let result;

    switch (vector_size) 
    {
        case 2: 
        {
            result = new v2(
                values[0],
                values[1]
            );

            break;
        }
        case 3:
        {
            result = new v3(
                values[0],
                values[1],
                values[2]
            );

            break;
        }
        case 4: 
        {
            result = new v4(
                values[0],
                values[1],
                values[2],
                values[3]
            );

            break;
        }
        default: crash_on_default_case_reach();
    }

    return result;
}

function make_v3_from_v2(v2_a, z)
{
    return make_v3(v2_a.x, x2_a.y, z);
}

function make_v4_from_v3(v3_a, w) 
{
    return make_v4(v3_a.x, v3_a.y, v3_a.z, w);
}

// Matrix Constructors

function make_matrix_from_1d_array(oda) 
{
    assert(in_bounds(oda.length, 4, 16));

    let size = Math.sqrt(oda.length);

    let result;

    switch (size) 
    {
        case 2:
        {
            result = new m2x2(
                oda[0], oda[1],
                oda[2], oda[3]
            );

            break;
        }
        case 3: 
        {
            result = new m3x3(
                oda[0], oda[1], oda[2],
                oda[3], oda[4], oda[5],
                oda[6], oda[7], oda[8]
            );

            break;
        }
        case 4: 
        {
            result = new m4x4(
                oda[0], oda[1], oda[2], oda[3],
                oda[4], oda[5], oda[6], oda[7],
                oda[8], oda[9], oda[10], oda[11],
                oda[12], oda[13], oda[14], oda[15]
            );

            break;
        }
        default: 
        {
            crash_on_default_case_reach();
        }
    }

    return result;
}

function make_matrix_from_2d_array(tda) 
{
    let size = tda.length;
    assert(tda.length === tda[0].length, "Matrix is not a square matrix");
    let result;

    switch (size) 
    {
        case 2: 
        {
            result = new m2x2(
                tda[0][0],  tda[0][1],   
                tda[1][0],  tda[1][1]
            );

            break;
        }
        case 3:
        {
            result = new m3x3(
                tda[0][0],  tda[0][1],  tda[0][2], 
                tda[1][0],  tda[1][1],  tda[1][2], 
                tda[2][0],  tda[2][1],  tda[2][2]
            );

            break;
        }
        case 4:
        {
            result = new m4x4(
                tda[0][0],  tda[0][1],  tda[0][2],  tda[0][3], 
                tda[1][0],  tda[1][1],  tda[1][2],  tda[1][3], 
                tda[2][0],  tda[2][1],  tda[2][2],  tda[2][3], 
                tda[3][0],  tda[3][1],  tda[3][2],  tda[3][3] 
            );

            break;
        }
        default: crash_on_default_case_reach();
    }

    return result;
}

function make_empty_matrix(size) 
{
    let result = null;

    switch (size)
    {  
        case 2: { result = make_m2x2(); break; }
        case 3: { result = make_m3x3(); break; }
        case 4: { result = make_m4x4(); break; }
        default: crash_on_default_case_reach();
    }

    return result;
}

function make_m2x2(a0, a1, b0, b1) 
{
    let result;

    if (!arguments.length) 
    {
        result = new m2x2(
            1.0, 0.0,
            0.0, 1.0
        );
    }
    else 
    {
        assert(arguments.length === 4);
        
        result = new m2x2(
            a0, a1,
            b0, b1
        );
    }
    
    return result;
}

function make_m3x3(a0, a1, a2, b0, b1, b2, c0, c1, c2)
{
    let result;

    if (!arguments.length) 
    {
        result = new m3x3(
            1.0, 0.0, 0.0, 
            0.0, 1.0, 0.0, 
            0.0, 0.0, 1.0
        );
    }
    else 
    {
        assert(arguments.length === 9);
        
        result = new m3x3(
            a0, a1, a2,
            b0, b1, b2,
            c0, c1, c2
        );
    }
    
    return result;
}

function make_m4x4(a0, a1, a2, a3, b0, b1, b2, b3, c0, c1, c2, c3, d0, d1, d2, d3)
{
    let result;

    if (!arguments.length) 
    {
        result = new m4x4(
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        );
    }
    else 
    {
        assert(arguments.length === 16);

        result = new m4x4(
            a0, a1, a2, a3,
            b0, b1, b2, b3,
            c0, c1, c2, c3,
            d0, d1, d2, d3
        );
    }
    
    return result;
}

function make_translation(vector_position)
{
    let result = make_m4x4();

    result.a3 = vector_position.x;
    result.b3 = vector_position.y;
    result.c3 = vector_position.z;

    return result;
}

function make_rotation_x(theta)
{
    let s = sine(theta);
    let c = cosine(theta);

    let result = make_m4x4();
    result.f[1][1] = c;
    result.f[1][2] = -s;
    result.f[2][1] = s;
    result.f[2][2] = c;

    result.update_properties_from_f();

    return result;
}

function make_rotation_y(theta)
{
    let s = sine(theta);
    let c = cosine(theta);

    let result = make_m4x4();
    result.f[0][0] = c;
    result.f[0][2] = s;
    result.f[2][0] = -s;
    result.f[2][2] = c;

    result.update_properties_from_f();

    return result;
}

function make_rotation_z(theta)
{
    let s = sine(theta);
    let c = cosine(theta);

    let result = make_m4x4();
    result.f[0][0] = c;
    result.f[0][1] = -s;
    result.f[1][0] = s;
    result.f[1][1] = c;

    result.update_properties_from_f();

    return result;
}

// v3 scale
function make_scale(scale)
{
    let result = make_m4x4();
    result.a0 = scale.x;
    result.b1 = scale.y;
    result.c2 = scale.z;

    return result;
}


function make_perspective(aspect_ratio, field_of_view, near, far)
{
    let angle = tangent(degrees_to_radians(field_of_view) / 2.0);

    let result = make_m4x4();
    result.f[0][0] = 1.0 / (aspect_ratio * angle);
    result.f[1][1] = 1.0 / angle;
    result.f[2][2] = -(far + near) / (far - near);
    result.f[2][3] = -(2.0 * far * near) / (far - near);
    result.f[3][2] = -1.0;
    result.f[3][3] = 0.0;

    result.update_properties_from_f();

    return result;
}

function make_camera_transform(position, rotation)
{
    rotation = rotation.transpose();
    rotation = rotation.to_m4x4();

    let position_x_rotation = matrix_multiply(rotation, position.to_v4());
    position_x_rotation = position_x_rotation.to_v3();
    position_x_rotation.negate();

    return matrix_multiply(rotation, make_translation(position));
}

// Vector Operations

function vector_add(a, b) 
{
    let b_is_vector = typeof b === "object" && b.e !== undefined;
    let result = [];

    if (b_is_vector)
    {
        assert(a.size === b.size, "Vector sizes are not equal!");

        for (let i = 0; i < a.size; i++) 
        {
            result[i] = a.e[i] + b.e[i];
        }
    }
    else 
    {
        for (let i = 0; i < a.size; i++)
        {
            result[i] = a.e[i] + b;
        }
    }

    return make_vector(result);
}

function vector_subtract(a, b)
{
    let b_is_vector = typeof b === "object" && b.e !== undefined;
    let result = [];

    if (b_is_vector)
    {
        assert(a.size === b.size, "Vector sizes are not equal!");

        for (let i = 0; i < a.size; i++) 
        {
            result[i] = a.e[i] - b.e[i];
        }
    }
    else 
    {
        for (let i = 0; i < a.size; i++)
        {
            result[i] = a.e[i] - b;
        }
    }

    return make_vector(result);

}

function vector_multiply(a, b)
{
    let b_is_vector = typeof b === "object" && b.e !== undefined;
    let result = [];

    if (b_is_vector)
    {
        assert(a.size === b.size, "Vector sizes are not equal!");

        for (let i = 0; i < a.size; i++) 
        {
            result[i] = a.e[i] * b.e[i];
        }
    }
    else 
    {
        for (let i = 0; i < a.size; i++)
        {
            result[i] = a.e[i] * b;
        }
    }

    return make_vector(result);
}

function vector_divide(a, b)
{
    let b_is_vector = typeof b === "object" && b.e !== undefined;
    let result = [];

    if (b_is_vector)
    {
        assert(a.size === b.size, "Vector sizes are not equal!");

        for (let i = 0; i < a.size; i++) 
        {
            result[i] = a.e[i] / b.e[i];
        }
    }
    else 
    {
        for (let i = 0; i < a.size; i++)
        {
            result[i] = a.e[i] / b;
        }
    }

    return make_vector(result);
}

function dot(a, b) 
{
    assert(a.size === b.size);
    let result = 0;

    for (let i = 0; i < a.size; i++) 
    {
        result += a.e[i] * b.e[i];
    }

    return result;
}

//@todo(Matt);
function cross(a, b)
{
    

}

function interpolate(a, b, t) 
{
    return vector_add(a, vector_multiply(vector_subtract(b, a), t));
}

function reflect(vector, normal, restitution = 1.0) 
{
    return vector_add(vector, vector_multiply(normal, -(1.0 + restitution) * dot(vector, normal)));
}

// Matrix Operations

//@todo(Matt): Maybe add support for addition/subtraction/div
function matrix_multiply(a, b) 
{
    let result = null;

    // call me a God, these two lines are going on my resume
    let b_is_matrix = typeof b == "object" && b.f !== undefined; 
    let b_is_vector = typeof b == "object" && b.x !== undefined;

    if (b_is_matrix) 
    {
        assert(a.size === b.size, `Matrices are of different sizes. ${a.size} !== ${b.size}`);

        result = make_empty_matrix(a.size);

        for (let i = 0; i < a.size; i++)
        {
            for (let j = 0; j < a.size; j++)
            {
                result.f[i][j] = 0.0;

                for (let k = 0; k < a.size; k++)
                {
                    result.f[i][j] += a.f[i][k] * b.f[k][j];
                }
            }
        }

        result.update_properties_from_f();
    }
    else if (b_is_vector) 
    {
        assert(a.size === b.size, `Matrix is a different size than vector. ${a.size} !== ${b.size}`)

        result = [];

        for (let i = 0; i < a.size; i++) 
        {
            result[i] = 0.0;
    
            for (let j = 0; j < a.size; j++) 
            {
                result[i] += a.f[i][j] * b.e[j];
            }
        }

        result = make_vector(result);
    }
    else
    {
        result = make_empty_matrix(a.size);

        for (let i = 0; i < a.size; i++)
        {
            for (let j = 0; j < a.size; j++)
            {
                result.f[i][j] = a[i][j] * b;
            }
        }
    }

    return result;
}

function test()
{
    let m4x4_a = make_m4x4(
        2, 2, 2, 2,
        3, 3, 3, 3,
        2, 2, 2, 2,
        2, 2, 2, 2
    );

    let v4_b = make_v4(2.0, 3.0, 4.0, 5.0);

    m4x4_a.print("A", 0);
    v4_b.print("B");

    let v4_a_times_b = matrix_multiply(m4x4_a, v4_b);
    v4_a_times_b.print("result");
}

// test();