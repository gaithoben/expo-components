import Fonts from './Fonts';
import Metrics from './Metrics';
import Colors from './Colors';

// This file is for a reusable grouping of Theme items.
// Similar to an XML fragment layout in Android

const ApplicationStyles = {
  screen: {
    mainContainer: {
      flex: 1
    },
    backgroundImage: {
      flex: 1,
      backgroundColor: Colors.cloud
    },
    container: {
      flex: 1,
      backgroundColor: Colors.transparent
    },
    section: {
      margin: Metrics.section,
      padding: Metrics.baseMargin
    },
    sectionText: {
      ...Fonts.style.normal,
      paddingVertical: Metrics.doubleBaseMargin,
      color: Colors.snow,
      marginVertical: Metrics.smallMargin,
      textAlign: 'center'
    },
    subtitle: {
      color: Colors.snow,
      padding: Metrics.smallMargin,
      marginBottom: Metrics.smallMargin,
      marginHorizontal: Metrics.smallMargin
    },
    titleText: {
      ...Fonts.style.h2,
      fontSize: 14,
      color: Colors.text
    }
  },
  form: {
    error: {
      color: '#F44336',
      fontSize: 12
    },
    inputContainer: {
      borderBottomWidth: 0,
      marginBottom: 5,
      flexWrap: 'wrap',
      alignItems: 'flex-start'
    },
    phoneInputBordered: {
      height: 45,
      width: '100%',
      minWidth: '90%',
      borderWidth: 1,
      borderColor: '#CCC',
      borderRadius: 5,
      ...Fonts.style.normal
    },
    textInput: error => ({
      height: 45,
      minWidth: '90%',
      borderWidth: 1,
      borderColor: error ? '#F44336' : '#CCC',
      borderRadius: 5,
      ...Fonts.style.normal
    }),
    twoFields:{
      flexDirection: 'row',
      alignItems: 'center'
    }
  },
  darkLabelContainer: {
    padding: Metrics.smallMargin,
    paddingBottom: Metrics.doubleBaseMargin,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
    marginBottom: Metrics.baseMargin
  },
  darkLabel: {
    fontFamily: Fonts.type.bold,
    color: Colors.snow
  },
  groupContainer: {
    margin: Metrics.smallMargin,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  sectionTitle: {
    ...Fonts.style.h4,
    color: Colors.coal,
    backgroundColor: Colors.ricePaper,
    padding: Metrics.smallMargin,
    marginTop: Metrics.smallMargin,
    marginHorizontal: Metrics.baseMargin,
    borderWidth: 1,
    borderColor: Colors.ember,
    alignItems: 'center',
    textAlign: 'center'
  },
  headerBar: {
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#FFF6FF'
    },
    titleText: {
      color: '#333C33'
    },
    headerTitleContainer: {
      marginLeft: 15
    },
    leftalignedTitleContainer: {
      flex: 1,
      marginLeft: 15,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center'
    }
  },
  darkheaderBar: {
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#000600'
    },
    headerButton: {
      color: '#FFFCFF'
    },
    headerText: {
      color: '#FFF6FF'
    },
    titleText: {
      color: '#FFF6FF'
    },
    headerTitle: {
      flex: 1,
      alignItems: 'flex-start'
    },
    headerTitleText: {
      ...Fonts.style.h5,
      color: '#FFFCFF'
    }
  }
};

export default ApplicationStyles;
