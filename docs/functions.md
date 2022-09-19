# Mathpad funciont

Mathpad is heavily based on [Nerdamer](https://nerdamer.com/) so further documentation could be inferred from its own web site. For simplicity in this doc we will use the *inline code* usage, but the same goes for the sidebar tool. Just remember that in the sidebar inputs you don't have to append the "=?" prefix. 
Note that some function could return different result depending on the "evaluation" flags (the symbolic/numeric bunnon in the sidebar or the `==?` vs `=~?` postfic): in the example it is reported explicitely in order to force evaluation in some cases. Sometimes, for clarity, only the result is displayed.
Also the examples tends to use numeric evaluation to show actual results, but all functions also work with symbolic arguments.


# General Math Functions




| function     | meaning                    | example             | result                                                           |
|--------------|----------------------------|---------------------|------------------------------------------------------------------|
| `log`        | Natural Logarithm          | `log(e^2)==?`       | $\ln\left( {e}^{2}\right) = 2$                                   |
| `log10`      | Logarithm (mase 10)        | `log10(100)=~?`     | $\log_{10}\left( 100\right) = 2$                                 |
| `min`        | Mininum                    | `min(1,2,3)=?`      | $\mathrm{min}\left(1,2,3\right) = 1$                             |
| `max`        | Maximum                    | `max(1,2,3)=?`      | $\mathrm{max}\left(1,2,3\right) = 3$                             |
| `abs`        | Absolute Value             | `abs(-1)=?`         | $\left\|- 1\right\| = 1$                                         |
| `floor`      | Floor                      | `floor(3/2)=~?`     | $\left \lfloor{\frac{3}{2}}\right \rfloor = 1$                   |
| `ceil`       | Ceiling                    | `ceil(3/2)=~?`      | $\left \lceil{\frac{3}{2}}\right \rceil = 2$                     |
| `Si`         | Sine Integral              | `Si(5)=~?`          | $\mathrm{Si}\left(5\right) = 1.5499312449446738$                 |
| `Ci`         | Cosine Integral            | `Ci(5)=~?`          | $\mathrm{Ci}\left(5\right) = -0.19002974965664432$               |
| `Ei`         | Exponential Integral       | `Ei(0)=~?`          | $\mathrm{Ei}\left(0\right) = -\infty$                            |
| `rect`       | Rectangular Function       | `rect(0)=~?`        | $\mathrm{rect}\left(0\right) = 1$                                |
| `step`       | Heaviside Step Function    | `step(0)=~?`        | $\mathrm{step}\left(0\right) = 0.5$                              |
| `sinc`       | Cardinal Sine              | `sinc(0)=~?`        | $\mathrm{sinc}\left(0\right) = 1$                                |
| `Shi`        | Hyperbolic Sine Integral   | `Shi(0)=~?`         | $\mathrm{Shi}\left(0\right) = 0$                                 |
| `Chi`        | Hyperbolic Cosine Integral | `Chi(0)=~?`         | $\mathrm{Chi}\left(0\right) = -\infty$                           |
| `fact`       | Factorial                  | `fact(5)=~?`        | $\mathrm{fact}\left(5\right) = 120$                              |
| `factorial`  | Factorial                  | `factorial(1/2)==?` | $\frac{1}{2}! = \frac{\sqrt{\pi}}{2}$                            |
| `!`          | Factorial                  | `5! =~?`            | $5 != 120$                                                       |
| `dfactorial` | Double Factorial           | `dfactorial(5)=~?`  | $5!! = 15$                                                       |
| `!!`         | Double Factorial           | `5!!=~?`            | $5!! = 15$                                                       |
| `exp`        | Exponential                | `diff(exp(x))=?`    | $\frac{d}{d x}\left({\mathrm{exp}\left(x\right)}\right) = e^{x}$ |
| `mod` | Modulus | `mod(7,4)=?`

## Simplification
Attempts to simplify an expression

`simplify(expression)

example:

`simplify((x^2-9)/(x+3))=?`

will convert to

$$ simplify\left(\frac{{x}^{2} - 9}{x + 3}\right) =  x-3$$

## Minimum

Returns the minimum among a set of num

# Trigonometry
Trigonometric functions works in radians and will try to return known values when possible. 
Available funcions: 

| function | meaning               | example          | result                                                                                                               |
|----------|-----------------------|------------------|----------------------------------------------------------------------------------------------------------------------|
| `cos`    | cosine                | `cos(pi)=?`      | $\mathrm{cos}\left(\pi\right) = -1$                                                                                  |
| `sin`    | sine                  | `sin(1/2)=~?`    | $\mathrm{sin}\left(1/2\right)=0.47942553860420299549$                                                                |
| `tan`    | tangent               | `tan(2pi)=?`     | $\mathrm{tan}\left(2*\pi\right)=0$                                                                                   |
| `sec`    | secant                | `diff(sec(x))=?` | $\frac{d}{d x}\left({\mathrm{sec}\left(x\right)}\right)=\mathrm{sec}\left(x\right) \cdot \mathrm{tan}\left(x\right)$ |
| `csc`    | cosecant              | `csc(pi/2)=?`    | $\mathrm{csc}\left(\pi/2\right)=1$                                                                                   |
| `cot`    | cotangent             | `cot(pi/4)==?`   | $\mathrm{cot}\left(\pi/4\right)=1$                                                                                   |
| `acos`   | arccosine             | `acos(-1)=~?`    | $\mathrm{acos}\left(-1\right)=3.14159265358979316028$                                                                |
| `asin`   | arcsine               | `asin(0)=~?`     | $\mathrm{asin}\left(0\right)=0$                                                                                      |
| `atan`   | arctangent            | `atan(-1)==?`    | $\mathrm{atan}\left(-1\right)=-\frac{\pi}{4}$                                                                        |
| `atan2`  | 2-argument arctangent | `atan2(1,2)=~?`  | $\mathrm{atan2}\left(1,2\right)=0.46364760900080610964$                                                              |
| `acsc`   | arccosecant           | `acsc(1)=~?`     | $\mathrm{acsc}\left(1\right)=1.57079632679489658014$                                                                 |
| `acot`   | arccotangent          | `acot(1)=~?`     | $\mathrm{acot}\left(1\right)=0.78539816339744838635$                                                                 |
| `asec`   | arcsecant             | `asec(1)==?`     | $\mathrm{asec}\left(1\right)=0$                                                                                      |

also available are the following hyberbolic functions:

`cosh`,`sinh`,`tanh`,`sech`,`csch`,`coth`,`acosh`,`asinh`,`atanh`,`asech`,`acsch` and `acoth`

# Matrix and Vector

## Defining a vector:

`vector(...elements)`

example:

`V1:=vector(1,2)`

or

`V1:=[1,2]`

$$[1, 2]$$
## Definine a matrix:

`matrix(...rows vectors)`

example:

`M:=matrix([a,b],[b,-a])`

$$\begin{vmatrix}a & b \cr b & -a\end{vmatrix}$$

`a+M=?`

$$\begin{vmatrix}2 \cdot a & a+b \cr a+b & 0\end{vmatrix}$$

## Getting the size of a matrix or vector

`size(matric or vector)`

example:

`size(M)=?`
$$\left[2, 2\right]$$

`size([1,2,3])=?`
$$3$$

## Transpose a matrix: 

`transpose(matrix)`

example:

`transpose(M)=?`

$$\begin{vmatrix}a & b \cr b & -a\end{vmatrix}$$

## Identity Matrix of given rank:

`imatrix(rank)`

example:

`imatrix(3)=?`

$$\begin{vmatrix}1 & 0 & 0 \cr 0 & 1 & 0 \cr 0 & 0 & 1\end{vmatrix}$$


## Determinant

`determinant(matric)`

example:

`determinant(matrix([8,7], [2,7]))=?`

$$42$$

## Inverse of a matrix:

`inverse(Matrix)`

example:

`A:=matrix([1,2],[4,4])`

$$\begin{vmatrix}1 & 2 \cr 4 & 4\end{vmatrix}$$

`invert(A)=?`

$$\begin{vmatrix}-1 & \frac{1}{2} \cr 1 & -\frac{1}{4}\end{vmatrix}$$

## Extracts a column (returning a vector). 
Note: it's 0-based

`matgetcol(matrix, columnIndex)`

example:

`matgetcol(M, 1)=?`

$$\begin{vmatrix}b \cr -a\end{vmatrix}$$

## Extracts a row (returning a vector). 
Note: it's 0-based

`matgetrow(matrix, rowIndex)`

example:

`matgetrow(M, 1)=?`

$$\begin{vmatrix}b & -a\end{vmatrix}$$

## Extract an element from a matrix, 
Note: 0-based

`matget(M, row, col)`

example:

`matget(M, 0, 1)=?`

$$b$$

## Setting an element in a matrix

`matset(Matrix, row, col, element)`

example:

`matset(M,0,1,x)=?`

$$\begin{vmatrix}a & x \cr b & -a\end{vmatrix}$$
## Setting a column in a matrix

`matsetcol(Matrix, columnIndex, column)`

example:

`matsetcol(M,1, [[x],[y]])=?`

$$\begin{vmatrix}a & x \cr b & y\end{vmatrix}$$

Note: columns needs to be passed as a vector of vectors.

## setting a row in a matrix

`matsetrow(Matrix, rowIndex, row)`

example:

`matsetrow(M,1, [y,z])=?`
$$\begin{vmatrix}a & b \cr y & z\end{vmatrix}$$

## Getting an element from a vector:

`vecget(vector, index)`

example:

`V1:=[a,x,x^2]`
$$[a, x, x^{2}]$$
`vecget(V1,1)=?`
$$x$$

## Setting an element into a vector:

`vecset(vector, index, element)`

example:

`vecset(V1,1, x-1)=?`
$$[a, x-1, x^{2}]$$

## Cross product

`cross(vector1, vector2)`

example:

`cross([1,2,3], [4,5,6])=?`
$$[-3, 6, -3]$$

## Dot product

`dot(vector1, vector2)`

example:

`dot([x,y,z],[1,0,-1])=?`
$$-z+x$$

# Imaginary numbers

Imaginary numbers are written like this:

`3i+4`

examples:

`(3i+4)+(2i-3)=?`
$$5 \cdot i+1$$

`(3i+4)(-3*i+4)=?`
$$\left(3 \cdot i+4\right) \cdot \left(-3 \cdot i+4\right)$$

`expand((3i+4)(-3*i+4))=?`
$$25$$

## Extracting Real part

`realpart(Z)`

example:

`a:=3i+4`

`realpart(a)=?`
will convert to

$$\operatorname{Re}\left(a\right) = 4$$

## Extracting imaginary part

`imagpart(a)=?`
will converto to
$$\operatorname{Im}\left(a\right) = 3$$

## Converting to polar form

`polarform(Z)`

example:

`polarform(a)==?`
$$5 \cdot e^{\mathrm{atan}\left(\frac{3}{4}\right) \cdot i}$$

NoteL actually evaluating the result will five back the original number.

## converting to rectangular form

`rectform(Z)`

example:

`rectform(e^(atan(1/5)*i)*sqrt(26))=~?`
will convert to:
$$rectform\left({e}^{\left(\mathrm{atan}\left(1/5\right) \cdot i\right)} \cdot \sqrt{26}\right) = i+5$$

## Getting the argument of a complex number

`arg(Z)`

example:

`arg(-1)==?`
$$\pi$$

## Getting the modulus of a complex number

you can use the `abs` (absolute value) funcion:

`abs(Z)`

example:

`abs(sqrt(2)/2+i*sqrt(2)/2)=~?`

will convert to:
$$\left|\frac{\sqrt{2}}{2} + i \cdot \frac{\sqrt{2}}{2}\right| = 1$$