import {
  Box,
  Container,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Menu,
} from "@material-ui/core";
import MoreIcon from "@material-ui/icons/MoreVert";
import { useState } from "react";

const theme = createTheme({
  palette: {
    common: {
      black: "rgb(51, 51, 51)",
    },
    primary: {
      main: "#c25a5e",
    },
    secondary: {
      main: "#2e2739",
    },
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Helvetica Neue", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
    caption: {
      fontSize: 14,
    },
    subtitle1: {
      fontWeight: 700,
    },
    subtitle2: {
      fontWeight: 700,
    },
    body1: {
      fontWeight: 400,
    },
    body2: {
      fontWeight: 400,
    },
  },
});

interface SkelProps {
  title: string;
  subtitle: React.ReactNode | string;
  children: React.ReactNode;
}

export default function Skel({ title, subtitle, children }: SkelProps) {
  const isNarrow = window.innerWidth <= 500;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="fixed" color="inherit">
        <Container maxWidth="lg">
          <Toolbar>
            <a
              href="https://www.immunisationcoalition.org.au/"
              style={{ flexGrow: 1 }}
            >
              <img
                style={{ padding: "15px 0", height: "70px" }}
                src="/ic-logo-with-text.png"
                alt="Immunisation Coalition Advocating for Immunisation Across the Lifespan"
              />
            </a>
            { isNarrow? (
              <>
                <IconButton
                  color="inherit"
                  onClick={(event: React.MouseEvent<HTMLElement>) => 
                    setAnchorEl(event.currentTarget)}
                >
                  <MoreIcon/>
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                  >
                    <MenuItem onClick={() => setAnchorEl(null)} component="a" 
                      href="https://www.immunisationcoalition.org.au/"
                    >
                        Home
                    </MenuItem>
                    <MenuItem onClick={() => setAnchorEl(null)} component="a" 
                      href="https://www.immunisationcoalition.org.au/disclaimer/"
                    >
                        Disclaimer
                    </MenuItem>
                    <MenuItem onClick={() => setAnchorEl(null)} component="a" 
                      href="https://www.immunisationcoalition.org.au/privacy-policy/"
                    >
                        Privacy policy
                    </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  href="https://www.immunisationcoalition.org.au/"
                >
                  Home
                </Button>
                <Button
                  color="primary"
                  href="https://www.immunisationcoalition.org.au/disclaimer/"
                >
                  Disclaimer
                </Button>
                <Button
                  color="primary"
                  href="https://www.immunisationcoalition.org.au/privacy-policy/"
                >
                  Privacy policy
                </Button>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Box>
        <Box pt={17} pb={2} style={{ backgroundColor: "#efecf2"  }}>
          <Container maxWidth="lg" style={{ backgroundImage: "url('/logos/CoricalBoat_logo.png')",
                                            backgroundSize: "17%",
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "right center",
                                            }}>
            <Typography style={{color:"#C14B4F", backgroundColor:"#DAE1ED"}} variant="h3" component="h1" paragraph>
              <p>    BETA VERSION FOR TESTING ONLY  - RESULTS NOT APPROVED FOR USE</p>
            </Typography>
            <Typography variant="h4" component="h1" paragraph>
              {title}
            </Typography>
            <Grid container spacing={1}>
            <Grid item xs={10} >
            <Typography variant="caption" paragraph>
              <p>
                CoRiCal is a tool to help people who are not sure about getting 
                the COVID-19 vaccines. It tells you how the vaccine can lower 
                your chance of getting or dying from COVID-19. It also shows 
                the chances of getting rare side effects from the vaccines.
              </p>
              <p>
                The tool shows you what your chances are of getting sick based 
                on your age, sex, and if you are vaccinated. It shows you the risk out of a million 
                people, or a one in x chance. You can choose how to show the 
                results by clicking on the tabs: 'Show risk as a chance' or  
                'Show risk per million people'.
              </p>
              <p>
                The results shown are only a rough guide. The tool shows the 
                average result for people with the same sex and age as you. It 
                doesn't consider other things that can change your chances of 
                getting COVID-19 or dying from it, like any health conditions 
                you have, where you work, or your COVID-19 safe behaviours.
              </p>
              <p>
                Even if there are not many cases in your community right now, 
                this can change. The number of cases can go up quickly at any 
                time. So when you make your decision about getting the COVID-19 
                vaccine, you should also think about the future.
              </p>

              <Box py={1}>
                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  href="/"
                >
                  Calculator
                </Button>{" "}
                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  href="/riskchart"
                >
                  Risk Chart
                </Button>{" "}
                <Button
                  variant="outlined"
                  color="primary"
                  disableElevation
                  href="/whatsnew"
                >
                  What's New!
                </Button>{" "}
                <Button
                  variant="outlined"
                  color="primary"
                  disableElevation
                  href="/videos"
                >
                  Video Overview
                </Button>{" "}
                <Button
                  variant="outlined"
                  color="primary"
                  disableElevation
                  href="/publications"
                >
                  Publications
                </Button>{" "}
                <Button
                  variant="outlined"
                  color="primary"
                  disableElevation
                  href="/faq"
                >
                  FAQ
                </Button>{" "}
                <Button
                  variant="outlined"
                  color="primary"
                  disableElevation
                  href="/moreinfo"
                >
                  More Info
                </Button>{" "}
                
              </Box>
            </Typography>
            </Grid>
            {/* <Grid item xs={3} >
            <Container maxWidth="lg">
              <img
                style={{ padding: "15px 0", height: "100px" }}
                src="/logos/CoRiCal_logo.png"
                alt="CoRiCal: Covid Risk Calculator"
              />
            </Container>
            </Grid> */}
            </Grid>
          </Container>
        </Box>
        <Box mt={4} mb={2}>
          <Container maxWidth="lg">
            {children}
            <Box pt={5}>
            <Typography variant="caption" paragraph>
              <b>CoRiCal co-chairs</b>: Andrew Baird, Colleen Lau, John Litt, Kirsty Short
              <br />
              <b>Project conception</b>: Andrew Baird, John Litt, Kirsty Short
              <br />
              <b>Web Development</b>:{" "}
              <a
                href="https://www.aapelivuorinen.com"
                style={{ textDecoration: "inherit", color: "inherit" }}
              >
                Aapeli Vuorinen
              </a>, Tina Moghaddam
              <br />
              <b>Subject expertise</b>: Andrew Baird, Anoop Enjeti, Colleen Lau,
              John Litt, Raj Puranik, Kirsty Short, Sudhir Wahi
              <br />
              <b>Model design</b>: Colleen Lau, Helen Mayfield, Kerrie Mengersen
              <br />
              <b>Data acquisition</b>: Andrew Baird, Anoop Enjeti, Colleen Lau,
              John Litt, Helen Mayfield, Kirsty Short, Sophie Wen, Phil Britton 
              <br />
              <b>Data analysis</b>: Samuel Brown, Colleen Lau, Helen Mayfield,
              Kerrie Mengersen, Jane Sinclair, Michael Waller
              <br />
              <b>Data visualisation and communication</b>: Kirsty Short, Jane
              Sinclair, Aapeli Vuorinen
              <br />
              <b>Risk Communication</b>: Carys Batcup, Carissa Bonner, 
              Colleen Lau, John Litt, Kirsty Short, Jane Sinclair, Hassan Vally
              <br />
              <b>Administration and project management</b>: Andrew Baird, Jayne Geddes,
              John Litt, Helen Mayfield, Kim Sampson, Kirsty Short
              <br />
            </Typography>
            </Box>
            <Box pt={5} pb={1}>
              <Button
                variant="outlined"
                color="primary"
                disableElevation
                href="https://forms.gle/8DW7NRF5z3JE8JCGA"
              >
                Feedback or comments?
              </Button>
            </Box>
          </Container>
        </Box>
        <Container maxWidth="lg">
          <Box mb={7}> <b> Collaborating institutions </b> </Box>
          <Grid container spacing={7}>
            <Grid item >
              <img
                style={{ padding: "0px 0", height: "80px", verticalAlign: "middle" }}
                src="/logos/UQ_logo_s.png"
                alt="University of Queensland"
              />
            </Grid>
            <Grid item >
              <img
                style={{ padding: "5px 0", height: "60px", verticalAlign: "middle" }}
                src="/logos/FU_logo.jpg"
                alt="Flinders University"
              />
            </Grid>
            <Grid item >
              <img
                style={{ padding: "5px 0", height: "50px", verticalAlign: "middle" }}
                src="/logos/QUT_logo_White_c.png"
                alt="Queensland University of Technology"
              />
            </Grid>
            <Grid item >
              <img
                style={{ padding: "5px 0", height: "60px", verticalAlign: "middle" }}
                src="/logos/USYD_logo.png"
                alt="University of Sydney"
              />
            </Grid>
            <Grid item >
              <img
                style={{ padding: "5px 0px", width: "120px", verticalAlign: "middle" }}
                src="/logos/Bayesfusion_logo.jpg"
                alt="BayesFusion"
              />
            </Grid>
          </Grid>
          <Box mt={3} mb={2}>&copy; 2022 Immunisation Coalition. </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

