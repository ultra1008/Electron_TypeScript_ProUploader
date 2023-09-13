${
    // Enable extension methods by adding using Typewriter.Extensions.*
    using Typewriter.Extensions.Types;
    using System.Text.RegularExpressions;
    using System.Collections;
    using System.Text;

    Template(Settings settings)
    {
        settings
            .IncludeProject("PhotoFinale.Api.Entities")
            .IncludeProject("Lucidiom.GeoCode")
            .IncludeProject("Lucidiom.PhotoFinale.Constants")
            //.IncludeProject("Trevoli.Lab.Components")
            .IncludeProject("Trevoli.Lab.Entity")
            .IncludeProject("Trevoli.PhotoFinale.Utility")
            .OutputExtension = ".ts";
    }

    // debug trick, "printf" lives!! https://github.com/frhagn/Typewriter/issues/121#issuecomment-231323983
    // concatenate anything you need into this debugInfo variable from your custom methods
    // and then throw $PrintDebugInfo into the main template space below to view in the output window
    static string debugInfo = "";
    string PrintDebugInfo(File f) => debugInfo; 

    // nested class support: https://github.com/frhagn/Typewriter/issues/134#issuecomment-253771122
    static List<Class> _classesInFile = new List<Class>();
    static List<Enum> _enumsInFile = new List<Enum>();

    bool ClassFilter(Class c) { 
      if (c.Namespace.StartsWith("PhotoFinale.Api.Entities")) {
        if (c.Namespace.EndsWith(".Converters")) {
          return false;
        }

        if (c.Namespace.EndsWith(".FujiDIS")) {
          return false;
        }

        return true;
      }

      if (c.Namespace.StartsWith("Lucidiom.GeoCode")) {
        return true;
      }

      if (c.Namespace.StartsWith("Trevoli.Lab.Entity.Search")) {
        return true;
      }

      //if (c.Namespace.StartsWith("Trevoli.Lab.Components.ContentItem")) {
      //  return true;
      //}

      if (c.Namespace.StartsWith("Trevoli.Lab.Entity")) {
        if (c.Name == "PaymentIntent") {
          return true;
        }
      }

      return false;
    }

    bool EnumFilter(Enum e) => (e.Namespace.StartsWith("PhotoFinale.Api.Entities") || e.Namespace.StartsWith("Lucidiom.PhotoFinale.Constants") || e.Namespace.StartsWith("Trevoli.Lab.Entity.Search") || e.Namespace.StartsWith("Trevoli.PhotoFinale.Utility")) && !e.Namespace.EndsWith(".FujiDIS");

    IEnumerable<Class> ClassesInFile(File f) {
        _classesInFile = f.Classes.Where(ClassFilter).Concat(f.Classes.SelectMany(c => c.NestedClasses).Where(ClassFilter)).ToList();
        return _classesInFile;
    }

    IEnumerable<Enum> EnumsInFile(File f) {
        _enumsInFile = f.Enums.Where(EnumFilter).ToList();
        return _enumsInFile;
    }

    string ClassName(Class c) {
        return c.Name + (c.BaseClass != null ? " extends " + c.BaseClass.Name : "");
    }

    string Constructor(Class c) {
        var ctor = "";

        if (c.Name == "FolioBorder") {
            ctor += "constructor() {\n";
            ctor += "\t\t\t" + "this.Color = \"#000000\";\n";
            ctor += "\t\t\t" + "this.Show = false;\n";
            ctor += "\t\t\t" + "this.Width = .125;\n";
            ctor += "\t\t" + "}\n";
        }

        if (c.Name == "FolioBackground") {
            ctor += "constructor() {\n";
            ctor += "\t\t\t" + "this.ApmId = \"Blank\";\n";
            ctor += "\t\t\t" + "this.BackgroundColor = \"#FFFFFF\";\n";
            ctor += "\t\t\t" + "this.BackgroundId = -1;\n";
            ctor += "\t\t\t" + "this.DisplayImageId = -1;\n";
            ctor += "\t\t\t" + "this.FullResImageId = -1;\n";
            ctor += "\t\t\t" + "this.ThumbnailImageId = -1;\n";
            ctor += "\t\t" + "}\n";
        }

        if (c.Name == "FolioLayoutRect") {
            ctor += "constructor() {\n";
            ctor += "\t\t\t" + "this.Index = -1;\n";
            ctor += "\t\t\t" + "this.Type = FolioLayoutRectTypes.Unknown;\n";
            ctor += "\t\t" + "}\n";
        }

        if (c.Name == "FolioLayoutImageRect") {
            ctor += "constructor() {\n";
            ctor += "\t\t\t" + "super();\n";
            ctor += "\t\t\t" + "this.PhotoBorder = new FolioBorder();\n";
            ctor += "\t\t\t" + "this.Type = FolioLayoutRectTypes.Image;\n";
            ctor += "\t\t" + "}\n";
        }

        if (c.Name == "FolioLayoutTextRect") {
            ctor += "constructor() {\n";
            ctor += "\t\t\t" + "super();\n";
            ctor += "\t\t\t" + "this.Align = FolioHorizontalAlignment.Center;\n";
            ctor += "\t\t\t" + "this.FontName = \"Times New Roman\";\n";
            ctor += "\t\t\t" + "this.FontSizeInPoints = 18;\n";
            ctor += "\t\t\t" + "this.FontColor = \"#000000\";\n";
            ctor += "\t\t\t" + "this.Orientation = FolioTextOrientation.Horizontal;\n";
            ctor += "\t\t\t" + "this.Type = FolioLayoutRectTypes.Text;\n";
            ctor += "\t\t\t" + "this.VerticalAlign = FolioVerticalAlignment.Center;\n";
            ctor += "\t\t" + "}\n";
        }

        if (c.Name == "FolioItem") {
            ctor += "constructor() {\n";
            ctor += "\t\t\t" + "this.Type = FolioItemTypes.Unknown;\n";
            ctor += "\t\t" + "}\n";
        }

        if (c.Name == "FolioBackgroundItem") {
            ctor += "constructor() {\n";
            ctor += "\t\t\t" + "super();\n";
            ctor += "\t\t\t" + "this.Image = new FolioImage();\n";
            ctor += "\t\t\t" + "this.Type = FolioItemTypes.Background;\n";
            ctor += "\t\t" + "}\n";
        }

        if (c.Name == "FolioFrameItem") {
            ctor += "constructor() {\n";
            ctor += "\t\t\t" + "super();\n";
            ctor += "\t\t\t" + "this.Image = new FolioImage();\n";
            ctor += "\t\t\t" + "this.Type = FolioItemTypes.Frame;\n";
            ctor += "\t\t" + "}\n";
        }

        if (c.Name == "PaymentCard") {
            ctor += "constructor() {\n";
            ctor += "\t\t\t" + "this.ExpirationMonth = undefined;\n";
            ctor += "\t\t\t" + "this.ExpirationYear = undefined;\n";
            ctor += "\t\t" + "}\n";
        }

        if (c.Name == "PaymentInfo") {
            ctor += "constructor() {\n";
            ctor += "\t\t\t" + "this.PaymentCard = new PaymentCard();\n";
            ctor += "\t\t\t" + "this.PaymentOption = PaymentOptions.None;\n";
            ctor += "\t\t" + "}\n";
        }

        if (c.Name == "SubmitOrderRequest") {
            ctor += "constructor() {\n";
            ctor += "\t\t\t" + "this.PaymentInfo = new PaymentInfo();\n";
            ctor += "\t\t" + "}\n";
        }

        return ctor;
    }

    string ImportClass(Class c){
        var imports = new List<string>();

        foreach (var p in c.Properties) {
            var types = TypeAndGenericTypes(p.Type);
            foreach (var type in types) {
                imports.Add(ImportType(type));
            }
        }

        if (c.BaseClass != null) { 
            imports.Add("import { " + c.BaseClass.Name +" } from \"./" + c.BaseClass.Name + "\";");
            imports.Add(ImportClass(c.BaseClass));
        } else{
            // no import needed
        }

        if (imports.Count > 0) {
            imports.Add("\n");
        }

        return String.Join("\n", imports.Distinct());
    }

    string ImportType(Type t){
        if (!t.IsPrimitive || t.IsEnum) {
            var typeName = t.Name;
            if (t.IsEnum) {
                if (_enumsInFile.Any(o => o.Name == typeName)) {
                    return "";
                }
            } else {
                typeName = t.IsEnumerable ? typeName.Replace("[]","") : typeName;
                if (_classesInFile.Any(o => o.Name == typeName)) {
                    return "";
                }
            }
            return "import { " + typeName.TrimEnd('[',']') + " } from \"./" + typeName.TrimEnd('[',']') + "\";";
        }

        return "";
    }

    string Imports(File f) {
        var classesInFile = ClassesInFile(f);
        var enumsInFile = EnumsInFile(f);

        //debugInfo += $"{f.Name} classes: " + string.Join("\r\n", classesInFile.Select(c => c.Name)) + "\r\n";
        //debugInfo += $"{f.Name} enums: " + string.Join("\r\n", enumsInFile.Select(e => e.Name)) + "\r\n";

        List<string> imports = classesInFile.Select(c => ImportClass(c)).ToList();

        return String.Join("\n", imports.Distinct());
    }

    string TypeConverter(Property p) {
        var result = p.Type.Name;
        if (p.Attributes.Any(a => a.Name == "Nullable") || p.Type.IsNullable) {
            result += " | null";
        }
        return result;
    }

    IEnumerable<Type> TypeAndGenericTypes(Type t) {
        var results = new List<Type>();

        results.Add(t);

        if (t.IsGeneric || t.IsEnumerable){
            foreach(var subtypes in t.TypeArguments){
                 results.AddRange(TypeAndGenericTypes(subtypes));
            }
        }
        return results;
    }

    string TypeDefault(Property p) {
        if (p.Type.IsEnum) {
            return $" = {p.Type.Name}.{p.Type.Constants[0].Name}";
        }
        if (p.Type.IsGuid) {
            return " = \"00000000-0000-0000-0000-000000000000\"";
        }
        if (p.Type.Name == "string") {
            return " = \"\"";
        }
        if (p.Type.IsEnumerable && !p.Type.IsGeneric) {
            return " = []";
        }
        if (p.Attributes.Any(a => a.Name == "Nullable") || p.Type.IsNullable) {
            return " = null";
        }
        if (p.Type.Default() == "null" && p.Attributes.Any(a => a.Name == "NotNullable")) {
            return "";
        }

        return " = " + p.Type.Default();
    }
}

$Imports$Classes(c => ClassFilter(c) || c.NestedClasses.Any(ClassFilter))[]
$ClassesInFile[
export class $ClassName {
    $Constructor$Properties[
    public $Name: $TypeConverter$TypeDefault;]
}
]
$Enums(c => EnumFilter(c))[
export const enum $Name {$Values[
    $Name = $Value][,]
}
]
