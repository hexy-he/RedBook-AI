import { List, Highlighter, Smile, Image, ArrowRight } from "lucide-react";

export default function Toolbar({ onAskClick }) {
  return (
    <div className="flex items-center justify-between bg-white px-[18px] py-3.5 rounded-xl border-t border-line">
      <div className="flex items-center gap-6">
        <span className="text-[24px] text-[#3A3A3A] font-medium w-6 h-6 flex items-center justify-center">
          Aa
        </span>

        <span className="w-6 h-6 text-[#3A3A3A]">
          <List size={24} />
        </span>

        <span className="w-6 h-6 text-[#3A3A3A]">
          <Highlighter size={24} />
        </span>

        <span className="w-6 h-6 text-[#3A3A3A]">
          <Smile size={24} />
        </span>

        <span className="w-6 h-6 text-[#3A3A3A]">
          <Image size={24} />
        </span>

        <button
          onClick={onAskClick}
          className="w-6 h-6 text-ask-blue"
          title="问一问"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 1254 1254"
            aria-label="问一问 logo"
          >
            <path
              d="M 752 74 L 733 74 L 722 77 L 708 84 L 693 97 L 682 112 L 649 178 L 629 209 L 621 219 L 607 233 L 596 241 L 583 247 L 566 252 L 554 253 L 553 254 L 522 254 L 521 253 L 513 253 L 512 252 L 493 250 L 457 241 L 420 234 L 394 232 L 393 231 L 356 231 L 355 232 L 339 233 L 317 238 L 300 244 L 280 254 L 270 260 L 251 275 L 234 293 L 221 311 L 214 323 L 202 349 L 193 380 L 192 394 L 191 395 L 190 415 L 191 416 L 191 428 L 192 429 L 194 447 L 204 481 L 214 504 L 234 540 L 254 569 L 281 602 L 305 627 L 305 629 L 256 678 L 236 701 L 213 731 L 201 749 L 188 772 L 181 787 L 172 812 L 168 833 L 169 858 L 173 871 L 177 879 L 185 890 L 197 900 L 206 905 L 221 910 L 232 911 L 233 912 L 256 913 L 257 912 L 276 912 L 277 911 L 315 909 L 316 908 L 348 908 L 349 909 L 358 909 L 359 910 L 371 911 L 383 914 L 397 919 L 415 929 L 432 944 L 447 965 L 465 1004 L 481 1055 L 495 1090 L 507 1113 L 526 1140 L 550 1164 L 566 1176 L 583 1186 L 611 1198 L 614 1198 L 625 1202 L 640 1205 L 647 1205 L 648 1206 L 659 1206 L 660 1207 L 689 1206 L 690 1205 L 706 1203 L 729 1196 L 746 1188 L 761 1179 L 777 1167 L 795 1150 L 811 1131 L 821 1117 L 835 1094 L 848 1068 L 858 1043 L 867 1016 L 878 970 L 886 971 L 897 975 L 925 982 L 934 983 L 949 987 L 973 990 L 974 991 L 982 991 L 992 993 L 1006 993 L 1007 994 L 1043 994 L 1044 993 L 1055 993 L 1056 992 L 1075 990 L 1107 981 L 1128 971 L 1135 966 L 1146 955 L 1151 948 L 1158 931 L 1159 910 L 1157 901 L 1153 890 L 1148 881 L 1120 845 L 1108 827 L 1088 789 L 1082 774 L 1076 752 L 1075 739 L 1074 738 L 1074 721 L 1075 720 L 1077 704 L 1081 692 L 1092 670 L 1100 658 L 1126 627 L 1153 592 L 1176 555 L 1185 536 L 1195 508 L 1202 473 L 1202 461 L 1203 460 L 1202 431 L 1201 430 L 1200 418 L 1193 393 L 1182 369 L 1172 353 L 1160 338 L 1147 325 L 1128 310 L 1097 293 L 1071 284 L 1034 277 L 1009 276 L 1008 277 L 993 277 L 992 278 L 972 280 L 936 289 L 916 296 L 903 302 L 899 302 L 894 288 L 890 271 L 871 218 L 862 197 L 843 159 L 835 147 L 833 142 L 823 127 L 810 112 L 792 96 L 775 86 L 756 77 Z"
              fill="#017AFC"
            />
          </svg>
        </button>
      </div>

      <span className="text-[16px] text-text-primary font-medium">完成</span>
    </div>
  );
}
