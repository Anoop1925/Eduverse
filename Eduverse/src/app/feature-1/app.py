import os
import cv2
from PIL import Image
import numpy as np
import google.generativeai as genai
import streamlit as st
from streamlit_extras.add_vertical_space import add_vertical_space
from mediapipe.python.solutions import hands, drawing_utils
from dotenv import load_dotenv
import warnings

warnings.filterwarnings(action='ignore')

# Load environment variables
load_dotenv()

# Page config with custom theme
st.set_page_config(
    page_title='Magic Learn AI App',
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom CSS to create a consistent UI/UX matching the image
st.markdown("""
<style>
    /* Theme colors */
    :root {
        --primary: #6366F1;
        --primary-light: #818CF8;
        --primary-dark: #4F46E5;
        --primary-bg: #EEF2FF;
        --primary-foreground: #ffffff;
        --background: #ffffff;
        --foreground: #020817;
        --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        --transition: all 0.3s ease;
        --border-radius: 0.75rem;
        --spacing-xs: 0.5rem;
        --spacing-sm: 1rem;
        --spacing-md: 1.5rem;
        --spacing-lg: 2rem;
    }
    
    /* Dark mode adjustments */
    @media (prefers-color-scheme: dark) {
        :root {
            --background: #020817;
            --foreground: #ffffff;
            --primary-bg: #1E293B;
            --card-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }
    }
    
    /* Global styles */
    .stApp {
        background-color: var(--background);
    }
    
    .stApp > header {
        background-color: var(--background);
        border-bottom: 1px solid rgba(0,0,0,0.1);
    }
    
    .block-container {
        padding-top: var(--spacing-sm);
        max-width: 100%;
        background: var(--background);
    }
    
    /* Header */
    .app-header {
        text-align: center;
        padding: var(--spacing-lg) var(--spacing-sm);
        background: var(--primary-bg);
        border-radius: var(--border-radius);
        margin-bottom: var(--spacing-md);
        box-shadow: var(--card-shadow);
        transition: var(--transition);
    }
    
    .app-header:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
    
    .app-header h1 {
        color: var(--primary);
        font-size: 2.5rem;
        margin: 0;
        font-weight: 700;
    }
    
    .app-header p {
        color: var(--foreground);
        opacity: 0.8;
        font-size: 1.1rem;
        margin-top: var(--spacing-xs);
    }
    
    /* Cards */
    .card {
        background: var(--background);
        border: 1px solid rgba(0,0,0,0.1);
        border-radius: var(--border-radius);
        box-shadow: var(--card-shadow);
        padding: var(--spacing-md);
        margin: var(--spacing-sm) 0;
        transition: var(--transition);
    }
    
    .card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
    
    /* Video Feed */
    .video-feed {
        max-width: 100%;
        border-radius: var(--border-radius);
        overflow: hidden;
        box-shadow: var(--card-shadow);
    }
    
    /* Gesture Controls */
    .gesture-controls {
        background: var(--background);
        border-radius: var(--border-radius);
        padding: var(--spacing-md);
        box-shadow: var(--card-shadow);
    }
    
    .gesture-title {
        color: var(--primary);
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: var(--spacing-md);
    }
    
    .gesture-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm);
        background: var(--primary-bg);
        border-radius: var(--border-radius);
        margin-bottom: var(--spacing-xs);
        transition: var(--transition);
    }
    
    .gesture-item:hover {
        background: rgba(99, 102, 241, 0.1);
        transform: translateX(5px);
    }
    
    .gesture-badge {
        background-color: var(--primary);
        color: var(--primary-foreground);
        padding: 0.5rem 1rem;
        border-radius: var(--border-radius);
        font-size: 0.9rem;
        font-weight: 500;
        white-space: nowrap;
    }
    
    .gesture-desc {
        color: var(--foreground);
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    /* AI Analysis */
    .analysis-section {
        background: var(--background);
        border-radius: var(--border-radius);
        padding: var(--spacing-md);
        box-shadow: var(--card-shadow);
        margin-top: var(--spacing-sm);
    }
    
    .analysis-title {
        color: var(--primary);
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: var(--spacing-md);
    }
    
    .analysis-box {
        background: var(--primary-bg);
        border-radius: var(--border-radius);
        overflow: hidden;
        transition: var(--transition);
    }
    
    .analysis-box:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
    
    .analysis-header {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        padding: var(--spacing-sm);
        background: var(--primary);
        color: var(--primary-foreground);
    }
    
    .analysis-icon {
        font-size: 1.25rem;
    }
    
    .analysis-header-title {
        font-weight: 600;
        font-size: 1rem;
    }
    
    .analysis-content {
        padding: var(--spacing-md);
        color: var(--foreground);
        font-size: 2rem;
        line-height: 1.6;
    }
    
    /* Form Elements */
    .stSelectbox div div div,
    .stTextArea div div textarea,
    .stFileUploader div div div {
        border-radius: var(--border-radius);
        border: 1px solid rgba(0,0,0,0.1);
        transition: var(--transition);
    }
    
    .stSelectbox div div div:hover,
    .stTextArea div div textarea:hover,
    .stFileUploader div div div:hover {
        border-color: var(--primary);
    }
    
    /* Buttons */
    .stButton > button {
        background-color: var(--primary);
        color: var(--primary-foreground);
        border-radius: var(--border-radius);
        padding: 0.75rem 1.5rem;
        font-weight: 500;
        transition: var(--transition);
        border: none;
        box-shadow: var(--card-shadow);
    }
    
    .stButton > button:hover {
        background-color: var(--primary-dark);
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
        .app-header h1 {
            font-size: 2rem;
        }
        
        .gesture-controls,
        .analysis-section {
            margin-top: var(--spacing-md);
        }
        
        .stButton > button {
            width: 100%;
        }
    }
</style>
""", unsafe_allow_html=True)

# Get API key from environment variable (more secure)
GOOGLE_API_KEY = os.getenv('GEMINI_API_KEY')
if not GOOGLE_API_KEY:
    st.error("⚠️ GEMINI_API_KEY not found in environment variables. Please set it in your .env file.")
    st.stop()

class MagicLearnDrawInAir:
    def __init__(self):
        self.cap = cv2.VideoCapture(0)
        if not self.cap.isOpened():
            st.error("Error: Could not open webcam. Please check your camera connection.")
            return
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 950)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 550)
        self.cap.set(cv2.CAP_PROP_BRIGHTNESS, 130)

        self.imgCanvas = np.zeros(shape=(550, 950, 3), dtype=np.uint8)
        self.mphands = hands.Hands(max_num_hands=1, min_detection_confidence=0.75)
        self.p1, self.p2 = 0, 0
        self.p_time = 0
        self.fingers = []

    def streamlit_config(self):
        st.markdown("""
            <div class='app-header'>
                <h1>Magic Learn DrawInAir</h1>
                <p>AI-powered gesture recognition for mathematical equations and diagrams</p>
            </div>
        """, unsafe_allow_html=True)
        add_vertical_space(1)

    def process_frame(self):
        success, img = self.cap.read()
        if not success or img is None:
            st.error("Error: Failed to capture frame from webcam.")
            return False
        img = cv2.resize(src=img, dsize=(950, 550))
        self.img = cv2.flip(src=img, flipCode=1)
        self.imgRGB = cv2.cvtColor(self.img, cv2.COLOR_BGR2RGB)
        return True

    def process_hands(self):
        result = self.mphands.process(image=self.imgRGB)
        self.landmark_list = []
        if result.multi_hand_landmarks:
            for hand_lms in result.multi_hand_landmarks:
                drawing_utils.draw_landmarks(image=self.img, landmark_list=hand_lms, connections=hands.HAND_CONNECTIONS)
                for id, lm in enumerate(hand_lms.landmark):
                    h, w, c = self.img.shape
                    x, y = lm.x, lm.y
                    cx, cy = int(x * w), int(y * h)
                    self.landmark_list.append([id, cx, cy])

    def identify_fingers(self):
        self.fingers = []
        if self.landmark_list:
            for id in [4, 8, 12, 16, 20]:
                if id != 4:
                    if self.landmark_list[id][2] < self.landmark_list[id - 2][2]:
                        self.fingers.append(1)
                    else:
                        self.fingers.append(0)
                else:
                    if self.landmark_list[id][1] < self.landmark_list[id - 2][1]:
                        self.fingers.append(1)
                    else:
                        self.fingers.append(0)
            for i in range(0, 5):
                if self.fingers[i] == 1:
                    cx, cy = self.landmark_list[(i + 1) * 4][1], self.landmark_list[(i + 1) * 4][2]
                    cv2.circle(img=self.img, center=(cx, cy), radius=5, color=(255, 0, 255), thickness=1)

    def handle_drawing_mode(self):
        if sum(self.fingers) == 2 and self.fingers[0] == self.fingers[1] == 1:
            cx, cy = self.landmark_list[8][1], self.landmark_list[8][2]
            if self.p1 == 0 and self.p2 == 0:
                self.p1, self.p2 = cx, cy
            cv2.line(img=self.imgCanvas, pt1=(self.p1, self.p2), pt2=(cx, cy), color=(255, 0, 255), thickness=5)
            self.p1, self.p2 = cx, cy
        elif sum(self.fingers) == 3 and self.fingers[0] == self.fingers[1] == self.fingers[2] == 1:
            self.p1, self.p2 = 0, 0
        elif sum(self.fingers) == 2 and self.fingers[0] == self.fingers[2] == 1:
            cx, cy = self.landmark_list[12][1], self.landmark_list[12][2]
            if self.p1 == 0 and self.p2 == 0:
                self.p1, self.p2 = cx, cy
            cv2.line(img=self.imgCanvas, pt1=(self.p1, self.p2), pt2=(cx, cy), color=(0, 0, 0), thickness=15)
            self.p1, self.p2 = cx, cy
        elif sum(self.fingers) == 2 and self.fingers[0] == self.fingers[4] == 1:
            self.imgCanvas = np.zeros(shape=(550, 950, 3), dtype=np.uint8)

    def blend_canvas_with_feed(self):
        img = cv2.addWeighted(src1=self.img, alpha=0.7, src2=self.imgCanvas, beta=1, gamma=0)
        imgGray = cv2.cvtColor(self.imgCanvas, cv2.COLOR_BGR2GRAY)
        _, imgInv = cv2.threshold(src=imgGray, thresh=50, maxval=255, type=cv2.THRESH_BINARY_INV)
        imgInv = cv2.cvtColor(imgInv, cv2.COLOR_GRAY2BGR)
        img = cv2.bitwise_and(src1=img, src2=imgInv)
        self.img = cv2.bitwise_or(src1=img, src2=self.imgCanvas)

    def analyze_image_with_genai(self):
        imgCanvas = cv2.cvtColor(self.imgCanvas, cv2.COLOR_BGR2RGB)
        imgCanvas = Image.fromarray(imgCanvas)
        genai.configure(api_key=GOOGLE_API_KEY)
        model = genai.GenerativeModel(model_name='gemini-2.0-flash-exp')
        prompt = "Analyze the image and provide the following:\n" \
                 "* If a mathematical equation is present:\n" \
                 "   - The equation represented in the image.\n" \
                 "   - The solution to the equation.\n" \
                 "   - A short explanation of the steps taken to arrive at the solution. Also it might present triangle which may have any side not given , assume mostly right angle triangle \n" \
                 "* If a drawing is present and no equation is detected:\n" \
                 "   - A brief description of the drawn image in simple terms.\n also if only a single text is present in the image, then just return the text only show the text only "
        response = model.generate_content([prompt, imgCanvas])
        return response.text

    def main(self):
        col1, col2 = st.columns([0.5, 0.5])
        with col1:
            st.markdown('<div class="card video-feed">', unsafe_allow_html=True)
            stframe = st.empty()
            st.markdown('</div>', unsafe_allow_html=True)
        with col2:
            st.markdown('<div class="card gesture-controls">', unsafe_allow_html=True)
            st.markdown('<div class="gesture-title">Gesture Controls</div>', unsafe_allow_html=True)
            gesture_items = [
                ("Thumb + Index", "Start drawing"),
                ("Thumb + Middle", "Erase drawing"),
                ("Thumb + Index + Middle", "Move without drawing"),
                ("Thumb + Pinky", "Clear canvas"),
                ("Index + Middle", "Analyze/Calculate")
            ]
            for badge, desc in gesture_items:
                st.markdown(f"""
                    <div class='gesture-item'>
                        <span class='gesture-badge'>{badge}</span>
                        <span class='gesture-desc'>{desc}</span>
                    </div>
                """, unsafe_allow_html=True)
            st.markdown('</div>', unsafe_allow_html=True)

            st.markdown('<div class="card analysis-section">', unsafe_allow_html=True)
            st.markdown('<div class="analysis-title">Analysis</div>', unsafe_allow_html=True)
            result_placeholder = st.empty()
            st.markdown('</div>', unsafe_allow_html=True)

        while True:
            if not self.cap.isOpened():
                add_vertical_space(5)
                st.markdown(body=f'<h4 style="text-align:center; color:orange;">Error: Could not open webcam. '
                                f'Please ensure your webcam is connected and try again</h4>', 
                            unsafe_allow_html=True)
                break

            if not self.process_frame():
                break
                
            self.process_hands()
            self.identify_fingers()
            self.handle_drawing_mode()
            self.blend_canvas_with_feed()

            self.img = cv2.cvtColor(self.img, cv2.COLOR_BGR2RGB)
            stframe.image(self.img, channels="RGB", use_column_width=True)

            if sum(self.fingers) == 2 and self.fingers[1] == self.fingers[2] == 1:
                result = self.analyze_image_with_genai()
                # A single, clean markdown call
                html = f"""
                <div class="analysis-box">
                <div class="analysis-header">
                    <span class="analysis-icon">🔍</span>
                    <span class="analysis-header-title">Analysis Result</span>
                </div>
                <div class="analysis-content">
                    {result}
                </div>
                </div>
                """
                result_placeholder.markdown(html, unsafe_allow_html=True)

            
            # if sum(self.fingers) == 2 and self.fingers[1] == self.fingers[2] == 1:
            #     result = self.analyze_image_with_genai()
            #     result_placeholder.markdown(f"""
            #         <div class='analysis-box'>
            #             <div class='analysis-header'>
            #                 <span class='analysis-icon'>🔍</span>
            #                 <span class='analysis-header-title'>Analysis Result</span>
            #             </div>
            #             <div class='analysis-content'>
            #                 {result}
            #             </div>
            #         </div>
            #     """, unsafe_allow_html=True)

        self.cap.release()
        cv2.destroyAllWindows()

def image_reader():
    st.markdown("""
        <div class='app-header'>
            <h1>Image Reader</h1>
            <p>Upload images for AI-powered analysis</p>
        </div>
    """, unsafe_allow_html=True)

    col1, col2 = st.columns([0.6, 0.4])
    with col1:
        uploaded_file = st.file_uploader("Upload an Image", type=["jpg", "jpeg", "png"], key="image_uploader")
        if uploaded_file:
            st.markdown('<div class="card">', unsafe_allow_html=True)
            st.image(uploaded_file, use_column_width=True)
            st.markdown('</div>', unsafe_allow_html=True)

    with col2:
        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.markdown('<h3 style="color: var(--primary); margin-bottom: 1rem;">Analysis Options</h3>', unsafe_allow_html=True)
        input_text = st.text_area("Add specific instructions for analysis:", height=100, key="input_text")
        if st.button("Analyze Image", key="analyze_btn"):
            try:
                image_parts = input_image_setup(uploaded_file)
                prompt = "Analyze the image and provide details based on the text input."
                response = get_gemini_response(input_text, image_parts, prompt)
                st.markdown(f"""
                    <div class='analysis-box'>
                        <div class='analysis-header'>
                            <span class='analysis-icon'>🔍</span>
                            <span class='analysis-header-title'>Analysis Result</span>
                        </div>
                        <div class='analysis-content'>
                            {response}
                        </div>
                    </div>
                """, unsafe_allow_html=True)
            except Exception as e:
                st.error(str(e))
        st.markdown('</div>', unsafe_allow_html=True)

def plot_crafter():
    st.markdown("""
        <div class='app-header'>
            <h1>Plot Crafter</h1>
            <p>Generate creative plots and stories</p>
        </div>
    """, unsafe_allow_html=True)

    col1, col2 = st.columns([0.6, 0.4])
    with col1:
        game_prompt = st.text_area("Enter your story theme or concept:", height=150, key="plot_input")
        if st.button("Generate Plot", key="generate_btn"):
            genai.configure(api_key=GOOGLE_API_KEY)
            model = genai.GenerativeModel('gemini-2.0-flash-exp')
            prompt = f"Create a detailed plot based on the theme: {game_prompt}"
            response = model.generate_content([prompt])
            st.markdown(f"""
                <div class='analysis-box'>
                    <div class='analysis-header'>
                        <span class='analysis-icon'>📝</span>
                        <span class='analysis-header-title'>Generated Plot</span>
                    </div>
                    <div class='analysis-content'>
                        {response.text}
                    </div>
                </div>
            """, unsafe_allow_html=True)

    with col2:
        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.markdown('<h3 style="color: var(--primary); margin-bottom: 1rem;">Features</h3>', unsafe_allow_html=True)
        features = [
            ("Creative Writing", "Generate unique story plots"),
            ("Character Development", "Create detailed characters"),
            ("Plot Structure", "Develop story arcs")
        ]
        for badge, desc in features:
            st.markdown(f"""
                <div style='display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;'>
                    <span style='background-color: var(--primary); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem;'>{badge}</span>
                    <span style='color: var(--foreground);'>{desc}</span>
                </div>
            """, unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

def input_image_setup(uploaded_file):
    if uploaded_file is not None:
        bytes_data = uploaded_file.getvalue()
        image_parts = [{"mime_type": uploaded_file.type, "data": bytes_data}]
        return image_parts
    else:
        raise FileNotFoundError("No file uploaded")

def get_gemini_response(input_text, image, prompt):
    model = genai.GenerativeModel('gemini-2.0-flash-exp')
    response = model.generate_content([input_text, image[0], prompt])
    return response.text

def main_app():
    st.markdown("""
        <div class='app-header'>
            <h1>Magic Learn</h1>
            <p>AI-powered learning tools with gesture recognition</p>
        </div>
    """, unsafe_allow_html=True)
    
    app_mode = st.selectbox(
        "Choose an application:",
        ["Magic Learn DrawInAir", "Image Reader", "Plot Crafter"],
        key="app_selector"
    )
    
    if app_mode == "Magic Learn DrawInAir":
        drawinair = MagicLearnDrawInAir()
        if hasattr(drawinair, 'cap'):  # Check if initialization was successful
            drawinair.streamlit_config()
            drawinair.main()
    elif app_mode == "Image Reader":
        image_reader()
    elif app_mode == "Plot Crafter":
        plot_crafter()

if __name__ == "__main__":
    main_app()