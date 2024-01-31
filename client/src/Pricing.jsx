import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/StarBorder';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import axios from 'axios';
function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const tiers = [
    {
        title: 'Free',
        price: '0',
        description: [
            '10 users included',
            '2 GB of storage',
            'Help center access',
            'Email support',
        ],
        buttonText: 'Sign up for free',
        buttonVariant: 'outlined',
    },
    {
        title: 'Pro',
        subheader: 'Most popular',
        price: '15',
        description: [
            '20 users included',
            '10 GB of storage',
            'Help center access',
            'Priority email support',
        ],
        buttonText: 'Get started',
        buttonVariant: 'contained',
    },
    {
        title: 'Enterprise',
        price: '30',
        description: [
            '50 users included',
            '30 GB of storage',
            'Help center access',
            'Phone & email support',
        ],
        buttonText: 'Contact us',
        buttonVariant: 'outlined',
    },
];

const footers = [
    {
        title: 'Company',
        description: ['Team', 'History', 'Contact us', 'Locations'],
    },
    {
        title: 'Features',
        description: [
            'Cool stuff',
            'Random feature',
            'Team feature',
            'Developer stuff',
            'Another one',
        ],
    },
    {
        title: 'Resources',
        description: ['Resource', 'Resource name', 'Another resource', 'Final resource'],
    },
    {
        title: 'Legal',
        description: ['Privacy policy', 'Terms of use'],
    },
];

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Pricing() {
    const [allPrices, setAllPrices] = React.useState(null)
    const [allProducts, setAllProducts] = React.useState(null)
    const [activeProd, setActiveProd] = React.useState(null)
    const [activePrices, setActivePrices] = React.useState(null)
    let [message, setMessage] = React.useState('');
    let [success, setSuccess] = React.useState(false);
    let [sessionId, setSessionId] = React.useState('');
    const [selectedSubs, setSelectedSubs] = React.useState(null)
    console.log('selectedSubs', selectedSubs)
    console.log(allPrices)

    React.useEffect(() => {
        if (localStorage.getItem('sessionIdSaved')) {
            getSelectedSubscription()
        }
    }, [])

    React.useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);

        if (query.get('success')) {
            setSuccess(true);
            setSessionId(query.get('session_id'));
            localStorage.setItem('sessionIdSaved', query.get('session_id'))
        }

        if (query.get('canceled')) {
            setSuccess(false);
            setMessage(
                "Order canceled -- continue to shop around and checkout when you're ready."
            );
        }
    }, [sessionId]);

    const fetchPrices = async () => {
        const result = await axios.get('http://localhost:5000/getAllPrices')
        console.log(result)
        setAllPrices(result?.data?.allProduct?.data)
        setAllProducts(result?.data?.products?.data)
    }
    React.useEffect(() => {
        fetchPrices()
    }, [])

    const CheckoutHandler = async (item) => {
        console.log(item)
        let obj = {
            productPricsId: item?.id
        }
        const result = await axios.post('http://localhost:5000/create-checkout-session', {
            body: obj
        })
        console.log(result)
    }

    const billingHandler = async () => {
        const result = await axios.post('http://localhost:5000/create-portal-session', {
            sessionID: localStorage.getItem('sessionIdSaved')
        })
        console.log(result)
        if (result) {
            localStorage.setItem('customerId', result?.data?.checkoutDetails?.customer)
            setTimeout(() => {
                getSelectedSubscription()
            }, 1000);
        }
    }

    const getSelectedSubscription = async () => {
        const susresult = await axios.post('http://localhost:5000/get-subscription', {
            customer: localStorage.getItem("customerId")
        })
        console.log(susresult)
        setSelectedSubs(susresult?.data?.subscriptions?.data?.[0])
        localStorage.setItem('selectedSubId', susresult?.data?.subscriptions?.data?.[0]?.id)
        localStorage.setItem('selectedSubItemId', susresult?.data?.subscriptions?.data?.[0]?.items?.data?.[0]?.id)
    }

    const upgradeHandler = async (item) => {
        console.log(item)

        const result = await axios.post('http://localhost:5000/changeSubscriptionMethod', {
            lookup_key: item.id,
            subscription_id: localStorage.getItem('selectedSubId'),
            subscription_item_id: localStorage.getItem('selectedSubItemId'),
            customerId: localStorage.getItem('customerId')
        })

        console.log(result)

        window.open(result?.data?.session?.url)
        // const result = await axios.post('http://localhost:5000/subsScheduling', {
        //     subsId: localStorage.getItem('selectedSubId'),
        //     priceId: item?.id,
        //     // customerId: localStorage.getItem('customerId')
        //     customerId: 'cus_PLovXrkEnQn2QS'
        // })
        // console.log(183, result)
    }

    const transformArray = (inputArray, productsList) => {
        console.log(productsList)
        
        const result = [];
      
        inputArray?.forEach((item, index) => {
            console.log('203====',item?.product_id)
            console.log(productsList?.[index])
          const productId = item.product;
          const priceObj = {
            id: item.id,
            amount: item.unit_amount,
            interval: item.recurring ? item.recurring.interval : null,
          };
      
          let productEntry = result.find((entry) => entry.product_id === productId);
      
          if (!productEntry) {
            productEntry = {
              product_id: productId,
              prices: [],
            };
            result.push(productEntry);
          }
      
          if (inputArray?.[index]?.product_id == inputArray?.[index+1]?.[index]) {
            productEntry.prices.push(priceObj);
          }
        });
      
        return result;
      };
      
      
      
    //   console.log(outputArray);

    const organizePricesByProduct = (prices, productIds) => {
        const productsWithPrices = [];
      
        productIds.forEach((productId) => {
          const productPrices = prices.filter((price) => price.product === productId);
            console.log(244,productPrices)
          if (productPrices.length > 0) {
            const productObject = {
              product_Id: productId,
              prices: productPrices.map(({ id, unit_amount, recurring }) => ({
                id,
                unit_amount: unit_amount,
                interval: recurring ? recurring.interval : null,
              })),
            };
      
            productsWithPrices.push(productObject);
          }
        });
      
        return productsWithPrices;
      };

    const productsArryHandler = (value) => {
        console.log(value)
        let productsList = value.map((item) => item?.id)
        console.log(productsList)
        setActiveProd(productsList)
        const result = organizePricesByProduct(allPrices, productsList);
console.log(267, result);
setActivePrices(result)
    }

  
      

    React.useEffect(() => {
        if(allPrices && allProducts) {
        productsArryHandler(allProducts)
        }
    },[allPrices, allProducts])

    return (
        <ThemeProvider theme={defaultTheme}>
            <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
            <CssBaseline />
            <AppBar
                position="static"
                color="default"
                elevation={0}
                sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
            >
                <Toolbar sx={{ flexWrap: 'wrap' }}>
                    <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                        Company name
                    </Typography>
                    <nav>
                        <Link
                            variant="button"
                            color="text.primary"
                            href="#"
                            sx={{ my: 1, mx: 1.5 }}
                        >
                            Features
                        </Link>
                        <Link
                            variant="button"
                            color="text.primary"
                            href="#"
                            sx={{ my: 1, mx: 1.5 }}
                        >
                            Enterprise
                        </Link>
                        <Link
                            variant="button"
                            color="text.primary"
                            href="#"
                            sx={{ my: 1, mx: 1.5 }}
                        >
                            Support
                        </Link>
                    </nav>
                    <Button href="#" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                        Login
                    </Button>
                </Toolbar>
            </AppBar>
            {/* Hero unit */}
            <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
                <Typography
                    component="h1"
                    variant="h2"
                    align="center"
                    color="text.primary"
                    gutterBottom
                >
                    Pricing
                </Typography>
                <Typography variant="h5" align="center" color="text.secondary" component="p">
                    Quickly build an effective pricing table for your potential customers with
                    this layout. It&apos;s built with default MUI components with little
                    customization.
                </Typography>
            </Container>
            {/* End hero unit */}
            <Container maxWidth="md" component="main">
                <Grid container spacing={5} alignItems="flex-end">
                    {allPrices?.map((tier) => {
                        let priceOfSinglePlan = `${tier?.unit_amount}`
                        // Enterprise card is full width at sm breakpoint
                        return (
                            <Grid
                                item
                                key={tier.title}
                                xs={12}
                                sm={tier.title === 'Enterprise' ? 12 : 6}
                                md={4}
                            >
                                <Card>
                                    <CardHeader
                                        title={tier.title}
                                        subheader={tier.subheader}
                                        titleTypographyProps={{ align: 'center' }}
                                        action={tier.title === 'Pro' ? <StarIcon /> : null}
                                        subheaderTypographyProps={{
                                            align: 'center',
                                        }}
                                        sx={{
                                            backgroundColor: (theme) =>
                                                theme.palette.mode === 'light'
                                                    ? theme.palette.grey[200]
                                                    : theme.palette.grey[700],
                                        }}
                                    />
                                    <CardContent>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'baseline',
                                                mb: 2,
                                            }}
                                        >
                                            <Typography component="h2" variant="h3" color="text.primary">
                                                ${priceOfSinglePlan?.slice(0, -2)}
                                            </Typography>
                                            <Typography variant="h6" color="text.secondary">
                                                /{tier?.recurring?.interval}
                                            </Typography>
                                        </Box>
                                        {/* <ul>
                                        {tier.description.map((line) => (
                                            <Typography
                                                component="li"
                                                variant="subtitle1"
                                                align="center"
                                                key={line}
                                            >
                                                {line}
                                            </Typography>
                                        ))}
                                    </ul> */}
                                    </CardContent>
                                    <CardActions>
                                        {
                                            localStorage?.getItem('selectedSubId')?.length > 0 ?
                                                <>
                                                    {/* <form action="http://localhost:5000/changeSubscriptionMethod" method="POST"> */}
                                                    <form action="http://localhost:5000/newsubscription" method="POST">
                                                    <input type="hidden" name="lookup_key" value={tier.id} />
                                                    <input type="hidden" name="subscription_id" value={localStorage.getItem('selectedSubId')} />
                                                    <input type="hidden" name="subscription_item_id" value={localStorage.getItem('selectedSubItemId')} />
                                                    <input type="hidden" name="customerId" value={localStorage.getItem('customerId')} />
                                                    <Button fullWidth variant={'contained'}
                                                        type='submit'
                                                        // type='button'
                                                        // onClick={() => { upgradeHandler(tier) }}
                                                    >
                                                        upgrade
                                                    </Button>
                                                    </form>
                                                </>
                                                :
                                                <form action="http://localhost:5000/create-checkout-session" method="POST">
                                                    <input type="hidden" name="lookup_key" value={tier.id} />
                                                    <input type="hidden" name="subscription_id" value={localStorage.getItem('selectedSubId')} />
                                                    <input type="hidden" name="subscription_item_id" value={localStorage.getItem('selectedSubItemId')} />
                                                    <Button fullWidth variant={'contained'}
                                                        type='submit'
                                                    // type='button'
                                                    // onClick={() => { CheckoutHandler(tier) }}
                                                    >
                                                        Checkout
                                                    </Button>
                                                </form>
                                        }
                                    </CardActions>
                                </Card>
                            </Grid>
                        )
                    })}
                    {
                        success && sessionId !== '' &&
                        <section style={{ width: "100%", textAlign: 'center' }}>
                            <div className="product Box-root">
                                <div className="description Box-root">
                                    <h3>Subscription to starter plan successful!</h3>
                                </div>
                            </div>
                            {/* <form action="http://localhost:5000/create-portal-session" method="POST"> */}
                            <input
                                type="hidden"
                                id="session-id"
                                name="session_id"
                                value={sessionId}
                            />
                            <button id="checkout-and-portal-button" type="button" onClick={() => {
                                billingHandler()
                            }}>
                                <span className='text-white' style={{ color: "#fff" }}>Manage your billing information</span>
                            </button>
                            {/* </form> */}
                        </section>
                    }

                    {

                        selectedSubs && (
                            <>
                                <Box style={{ marginTop: 20 }}>
                                    <h4>Selected Plan</h4>
                                    <Grid item>
                                        <Card>
                                            <CardHeader

                                                sx={{
                                                    backgroundColor: (theme) =>
                                                        theme.palette.mode === 'light'
                                                            ? theme.palette.grey[200]
                                                            : theme.palette.grey[700],
                                                }}
                                            />
                                            <CardContent>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'baseline',
                                                        mb: 2,
                                                    }}
                                                >
                                                    <Typography component="h2" variant="h3" color="text.primary">
                                                        {`$${selectedSubs?.plan?.amount / 100}`}
                                                    </Typography>
                                                    <Typography variant="h6" color="text.secondary">
                                                        /{selectedSubs?.plan?.interval}
                                                    </Typography>
                                                </Box>
                                            </CardContent>

                                        </Card>
                                    </Grid>
                                </Box>
                            </>
                        )
                    }
                </Grid>
            </Container>
            {/* Footer */}
            <Container
                maxWidth="md"
                component="footer"
                sx={{
                    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                    mt: 8,
                    py: [3, 6],
                }}
            >
                <Grid container spacing={4} justifyContent="space-evenly">
                    {footers.map((footer) => (
                        <Grid item xs={6} sm={3} key={footer.title}>
                            <Typography variant="h6" color="text.primary" gutterBottom>
                                {footer.title}
                            </Typography>
                            <ul>
                                {footer.description.map((item) => (
                                    <li key={item}>
                                        <Link href="#" variant="subtitle1" color="text.secondary">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </Grid>
                    ))}
                </Grid>
                <Copyright sx={{ mt: 5 }} />
            </Container>
            {/* End footer */}
        </ThemeProvider >
    );
}