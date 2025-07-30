import streamlit as st
from pathlib import Path

# Set page configuration
st.set_page_config(
    page_title="GA4 Analytics Performance Report", 
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="collapsed"
)

def load_html_content():
    """Load HTML content from external file"""
    html_file = Path("ga4_dashboard.html")
    
    if html_file.exists():
        return html_file.read_text(encoding='utf-8')
    else:
        st.error("HTML dashboard file not found. Please ensure 'ga4_dashboard.html' exists in the project directory.")
        return None

def main():
    """Main application function"""
    # Load and display the HTML dashboard
    html_content = load_html_content()
    
    if html_content:
        st.html(html_content)
    else:
        st.stop()

if __name__ == "__main__":
    main()