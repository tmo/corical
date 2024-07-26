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
            {/* <Typography style={{color:"#C14B4F", backgroundColor:"#DAE1ED"}} variant="h3" component="h1" paragraph>
              <p>    BETA VERSION FOR TESTING ONLY  - RESULTS NOT APPROVED FOR USE</p>
            </Typography>                                   */}
            <Typography variant="h4" component="h1" paragraph>
              {title}
            </Typography>
            <Grid container spacing={1}>
            <Grid item xs={10} >
            <Typography variant="caption" paragraph>
              <p>
                CoRiCal is a tool to help people make decisions about getting a 
                COVID-19 vaccine. It shows how the vaccine can lower the chance 
                of catching, getting sick from or dying from COVID-19. It also 
                shows the chance of getting rare side effects from the vaccines.
              </p>
              <p>
                The tool shows the chance based on your age, sex, and 
              vaccinations. You can choose to see the results ‘as a chance' or 
              'per million people' by clicking on the tabs.
              </p>
              <p>
                The results shown are only a guide. The tool shows the average 
                result for people with the same sex and age as you. This tool 
                does not consider other things that can change your chance of 
                infection or illness from COVID-19. This includes your general 
                health, where you work or go to school, or your COVID-19 safe 
                behaviours.
              </p>
              <p>
                When making decisions about getting a COVID-19 vaccine, you 
                should also consider how your chance might change in the future. 
                This might include a change in the number of cases in your 
                community or travel to an area with more cases.
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
              <b>CoRiCal co-chairs</b>: Colleen Lau, John Litt, Kirsty Short
              <br />
              <b>Project conception</b>: Andrew Baird, John Litt, Kirsty Short
              <br />
              <b>Web Development</b>:{" "}
              <a
                href="https://www.aapelivuorinen.com"
                style={{ textDecoration: "inherit", color: "inherit" }}
              >
                Aapeli Vuorinen
              </a>, Tina Moghaddam, Hongen Lu
              <br />
              <b>Subject expertise</b>: Andrew Baird, Anoop Enjeti, Colleen Lau, 
              John Litt, Raj Puranik, Kirsty Short, Tej Shukla, Sudhir Wahi, 
              Olivia Williams, Sophie Wen, Phil Britton
              <br />
              <b>Model design</b>: Colleen Lau, Helen Mayfield, 
              Kerrie Mengersen, Tej Shukla, Jane Sinclair, Ramona Muttucumaru, 
              Sam Brown, Olivia Williams
              <br />
              <b>Data acquisition</b>: Andrew Baird, Anoop Enjeti, Colleen Lau, 
              John Litt, Tej Shukla, Kirsty Short 
              <br />
              <b>Data analysis</b>: Samuel Brown, Colleen Lau, Helen Mayfield, 
              Kerrie Mengersen, Jane Sinclair, Michael Waller
              <br />
              <b>Risk Communication</b>: Carissa Bonner (videos), Colleen Lau, John Litt, 
              Kirsty Short, Jane Sinclair 
              <br />
              <b>Administration and project management</b>: Jayne Geddes, 
              John Litt, Helen Mayfield, Kim Sampson, Kirsty Short, Hongen Lu
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
          <Box mt={3} mb={2}>&copy; 2021-2023 Immunisation Coalition. </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

